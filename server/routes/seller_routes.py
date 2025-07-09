from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

from models import db, Product, Order, SellerProfile, User
from utils.auth_helpers import seller_required

logger = logging.getLogger(__name__)
seller_bp = Blueprint('seller_bp', __name__, url_prefix='/api/sellers')

@seller_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@seller_required
def get_seller_dashboard():
    user_id = get_jwt_identity()
    # This is a placeholder. A real implementation would query the database
    # for sales, revenue, etc. related to the seller.
    return jsonify({'message': 'Welcome to your seller dashboard!'}), 200

@seller_bp.route('/dashboard-stats', methods=['GET'])
@jwt_required()
@seller_required
def get_seller_dashboard_stats():
    user_id = get_jwt_identity()
    try:
        # Get the seller profile
        seller_profile = SellerProfile.query.filter_by(user_id=user_id).first()
        if not seller_profile:
            return jsonify({'message': 'Seller profile not found'}), 404
            
        # Get products count
        products_count = Product.query.filter_by(seller_id=seller_profile.id).count()
        
        # Get orders count and total sales
        # This is a simplified query. A real implementation would be more complex.
        orders = Order.query.join(Order.items).join(Product).filter(Product.seller_id == seller_profile.id).all()
        orders_count = len(orders)
        total_sales = sum(order.total_amount for order in orders) if orders else 0
        
        # Calculate actual products sold from order items
        products_sold = 0
        if orders:
            from models import OrderItem
            # Count actual products sold from order items
            products_sold_query = db.session.query(db.func.sum(OrderItem.quantity)).join(Product).filter(
                OrderItem.order_id.in_([order.id for order in orders]),
                Product.seller_id == seller_profile.id
            ).scalar()
            products_sold = products_sold_query or 0
        
        # Return dashboard stats
        return jsonify({
            'total_products': products_count,
            'total_orders': orders_count,
            'total_sales': float(total_sales),
            'products_sold': int(products_sold)  # Now correctly calculated from order items
        }), 200
    except Exception as e:
        logger.error(f"Error fetching seller dashboard stats: {str(e)}")
        return jsonify({'message': f'Error fetching dashboard stats: {str(e)}'}), 500

@seller_bp.route('/recent-activity', methods=['GET'])
@jwt_required()
@seller_required
def get_seller_recent_activity():
    user_id = get_jwt_identity()
    try:
        # Get the seller profile
        seller_profile = SellerProfile.query.filter_by(user_id=user_id).first()
        if not seller_profile:
            return jsonify({'message': 'Seller profile not found'}), 404
            
        # Get recent orders
        # This is a simplified query. A real implementation would be more complex.
        recent_orders = Order.query.join(Order.items).join(Product).filter(
            Product.seller_id == seller_profile.id
        ).order_by(Order.created_at.desc()).limit(5).all()
        
        # Format the recent activity data
        activities = []
        for order in recent_orders:
            activities.append({
                'id': order.id,
                'type': 'order',
                'description': f'New order #{order.id[:8]} received',
                'amount': float(order.total_amount),
                'date': order.created_at.isoformat() if order.created_at else None
            })
        
        return jsonify(activities), 200
    except Exception as e:
        logger.error(f"Error fetching seller recent activity: {str(e)}")
        return jsonify({'message': f'Error fetching recent activity: {str(e)}'}), 500

@seller_bp.route('/products', methods=['GET'])
@jwt_required()
@seller_required
def get_seller_products():
    user_id = get_jwt_identity()
    seller_profile = SellerProfile.query.filter_by(user_id=user_id).first()
    if not seller_profile:
        return jsonify({'message': 'Seller profile not found'}), 404
    products = Product.query.filter_by(seller_id=seller_profile.id).all()
    return jsonify([product.to_dict() for product in products]), 200

@seller_bp.route('/insights', methods=['GET'])
@jwt_required()
@seller_required
def get_seller_insights():
    user_id = get_jwt_identity()
    timeframe = request.args.get('timeframe', '30days')
    
    try:
        # Get the seller profile
        seller_profile = SellerProfile.query.filter_by(user_id=user_id).first()
        if not seller_profile:
            return jsonify({'message': 'Seller profile not found'}), 404
            
        # Get products count
        products = Product.query.filter_by(seller_id=seller_profile.id).all()
        products_count = len(products)
        
        # Create mock data for insights since we don't have real data yet
        mock_insights = {
            'totalRevenue': 0.00,
            'salesGrowth': 0.00,
            'productsSold': 0,
            'averageOrderValue': 0.00,
            'conversionRate': 0.00,
            'newCustomers': 0,
            'customerRetentionRate': 0.00,
            'revenueByDay': [{'date': f'2025-07-{i:02d}', 'revenue': 0.00} for i in range(1, 31)],
            'revenueByMonth': [
                {'month': 'Jan', 'revenue': 0.00},
                {'month': 'Feb', 'revenue': 0.00},
                {'month': 'Mar', 'revenue': 0.00},
                {'month': 'Apr', 'revenue': 0.00},
                {'month': 'May', 'revenue': 0.00},
                {'month': 'Jun', 'revenue': 0.00},
                {'month': 'Jul', 'revenue': 0.00}
            ],
            'topProducts': [],
            'productCategories': [],
            'salesByRegion': [],
            'cartAbandonment': 0.00,
            'recentOrders': [],
            'productPerformance': [{
                'id': product.id,
                'name': product.name,
                'price': float(product.price),
                'inventory_count': product.inventory_count,
                'status': product.status,
                'units_sold': 0,
                'total_revenue': 0.00
            } for product in products],
            'topCustomers': []
        }
        
        return jsonify(mock_insights), 200
    except Exception as e:
        logger.error(f"Error fetching seller insights: {str(e)}")
        return jsonify({'message': f'Error fetching insights: {str(e)}'}), 500

@seller_bp.route('/orders', methods=['GET'])
@jwt_required()
@seller_required
def get_seller_orders():
    user_id = get_jwt_identity()
    seller_profile = SellerProfile.query.filter_by(user_id=user_id).first()
    if not seller_profile:
        return jsonify({'message': 'Seller profile not found'}), 404
    
    # This is a simplified query. A real implementation would be more complex.
    orders = Order.query.join(Order.items).join(Product).filter(Product.seller_id == seller_profile.id).all()
    return jsonify([order.to_dict() for order in orders]), 200

@seller_bp.route('/profile', methods=['PUT'])
@jwt_required()
@seller_required
def update_seller_profile():
    user_id = get_jwt_identity()
    logger.info(f"Updating seller profile for user {user_id}")
    data = request.get_json()
    
    try:
        # Get the user with all related profiles
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Get or create seller profile
        seller_profile = user.seller_profile
        if not seller_profile:
            return jsonify({'message': 'Seller profile not found'}), 404
        
        # Update seller profile fields
        for key, value in data.items():
            if hasattr(seller_profile, key):
                setattr(seller_profile, key, value)
        
        db.session.commit()
        
        # Return the updated user data with full profile information
        user_data = user.to_dict()
        
        # Add profile data if it exists
        if user.profile:
            user_data['profile'] = user.profile.to_dict()
        
        # Add seller profile
        user_data['seller_profile'] = seller_profile.to_dict()
        
        return jsonify(user_data), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating seller profile: {str(e)}")
        return jsonify({'message': f'Error updating seller profile: {str(e)}'}), 500
