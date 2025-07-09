from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from datetime import datetime

from models import db, Order, OrderItem, Cart, CartItem, Product, User
from utils.validators import validate_order
from utils.email_service import send_order_confirmation_email

order_bp = Blueprint('order', __name__)

@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_orders():
    """Get all orders for the authenticated user"""
    user_id = get_jwt_identity()
    
    try:
        # Get query parameters
        status = request.args.get('status')
        limit = request.args.get('limit', 10, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Base query
        query = Order.query.filter_by(user_id=user_id)
        
        # Apply status filter if provided
        if status:
            query = query.filter_by(status=status)
        
        # Get total count
        total = query.count()
        
        # Get orders with pagination
        orders = query.order_by(Order.created_at.desc()).offset(offset).limit(limit).all()
        
        return jsonify({
            'orders': [order.to_dict() for order in orders],
            'total': total
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching orders: {str(e)}'}), 500

@order_bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order_details(order_id):
    """Get details of a specific order"""
    user_id = get_jwt_identity()
    
    try:
        # Find order
        order = Order.query.filter_by(id=order_id).first()
        
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Check if user owns the order or is an admin
        user = User.query.get(user_id)
        if order.user_id != user_id and user.role != 'admin':
            return jsonify({'message': 'Unauthorized access to this order'}), 403
        
        return jsonify(order.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching order details: {str(e)}'}), 500

@order_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    """Create a new order from cart"""
    user_id = get_jwt_identity()
    data = request.json
    
    # Validate order data
    errors = validate_order(data)
    if errors:
        return jsonify({'message': 'Validation failed', 'errors': errors}), 400
    
    try:
        # Find user's cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        if not cart or not cart.items:
            return jsonify({'message': 'Cart is empty'}), 400
        
        # Calculate total amount
        total_amount = 0
        for item in cart.items:
            total_amount += item.price * item.quantity
        
        # Create order
        order = Order(
            id=str(uuid.uuid4()),
            user_id=user_id,
            status='pending',
            payment_status='pending',
            payment_method=data['payment_method'],
            shipping_address=data['shipping_address'],
            billing_address=data.get('billing_address', data['shipping_address']),
            total_amount=total_amount,
            notes=data.get('notes', '')
        )
        
        db.session.add(order)
        db.session.flush()  # Get the ID without committing
        
        # Create order items from cart items
        for cart_item in cart.items:
            # Get product
            product = Product.query.get(cart_item.product_id)
            
            if not product or product.status != 'active':
                db.session.rollback()
                return jsonify({
                    'message': f'Product {product.name if product else "Unknown"} is no longer available'
                }), 400
            
            if product.stock_quantity < cart_item.quantity:
                db.session.rollback()
                return jsonify({
                    'message': f'Not enough stock for {product.name}'
                }), 400
            
            # Create order item
            order_item = OrderItem(
                id=str(uuid.uuid4()),
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=cart_item.price,
                # If this came from an affiliate link, we would set these:
                # affiliate_id=cart_item.affiliate_id,
                # commission_rate=affiliate_profile.commission_rate if affiliate_profile else 0,
                # commission_amount=calculated_commission
            )
            
            db.session.add(order_item)
            
            # Update product stock
            product.stock_quantity -= cart_item.quantity
        
        # Clear cart
        CartItem.query.filter_by(cart_id=cart.id).delete()
        
        # Commit changes
        db.session.commit()
        
        # Get user for email
        user = User.query.get(user_id)
        
        # Send order confirmation email
        if user and user.email:
            send_order_confirmation_email(user.email, order)
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating order: {str(e)}'}), 500

@order_bp.route('/<order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    """Cancel an order"""
    user_id = get_jwt_identity()
    
    try:
        # Find order
        order = Order.query.filter_by(id=order_id, user_id=user_id).first()
        
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Check if order can be canceled
        if order.status not in ['pending', 'processing']:
            return jsonify({'message': 'Order cannot be canceled at this stage'}), 400
        
        # Update order status
        order.status = 'canceled'
        order.updated_at = datetime.utcnow()
        
        # Restore product stock
        for item in order.items:
            product = Product.query.get(item.product_id)
            if product:
                product.stock_quantity += item.quantity
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order canceled successfully',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error canceling order: {str(e)}'}), 500

@order_bp.route('/<order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """Update order status (admin or seller only)"""
    user_id = get_jwt_identity()
    data = request.json
    
    if not data or 'status' not in data:
        return jsonify({'message': 'Status is required'}), 400
    
    status = data['status']
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'canceled']
    
    if status not in valid_statuses:
        return jsonify({'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}), 400
    
    try:
        # Find order
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'message': 'Order not found'}), 404
        
        # Check user authorization
        user = User.query.get(user_id)
        
        if not user or (user.role != 'admin' and user_id != order.user_id):
            return jsonify({'message': 'Unauthorized to update this order'}), 403
        
        # Update order status
        order.status = status
        order.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating order status: {str(e)}'}), 500
