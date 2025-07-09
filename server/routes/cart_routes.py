from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

from models import db, Cart, CartItem, Product

cart_bp = Blueprint('cart_bp', __name__, url_prefix='/api/cart')

# Create a decorator to handle OPTIONS requests
def handle_options_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            response.headers.add('Access-Control-Max-Age', '3600')
            return response
        return f(*args, **kwargs)
    return decorated_function

@cart_bp.route('/', methods=['GET', 'OPTIONS'])
@handle_options_request
def get_cart():
    if request.method == 'OPTIONS':
        return make_response()
    
    try:
        # Try to get the user identity, but don't require it
        user_id = get_jwt_identity()
        if user_id:
            cart = Cart.query.filter_by(user_id=user_id).first()
            if not cart:
                # Create a cart if it doesn't exist
                cart = Cart(user_id=user_id)
                db.session.add(cart)
                db.session.commit()
            return jsonify(cart.to_dict_with_items())
        else:
            # Return empty cart for non-authenticated users
            return jsonify({"items": [], "total": 0})
    except Exception as e:
        # Handle any JWT errors gracefully
        return jsonify({"items": [], "total": 0})

@cart_bp.route('/items', methods=['POST', 'OPTIONS'])
@handle_options_request
def add_to_cart():
    if request.method == 'OPTIONS':
        return make_response()
        
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"message": "Authentication required"}), 401
            
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
    except Exception as e:
        return jsonify({"message": f"Error processing request: {str(e)}"}), 400

    if not product_id or not isinstance(quantity, int) or quantity < 1:
        return jsonify({'message': 'Invalid request data'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()

    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    return jsonify(cart.to_dict_with_items()), 200

@cart_bp.route('/items/<int:item_id>', methods=['PUT', 'OPTIONS'])
@handle_options_request
def update_cart_item(item_id):
    if request.method == 'OPTIONS':
        return make_response()
        
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"message": "Authentication required"}), 401
            
        data = request.get_json()
        quantity = data.get('quantity')
    except Exception as e:
        return jsonify({"message": f"Error processing request: {str(e)}"}), 400

    if not isinstance(quantity, int) or quantity < 0:
        return jsonify({'message': 'Invalid quantity'}), 400

    cart_item = CartItem.query.get(item_id)
    if not cart_item or cart_item.cart.user_id != user_id:
        return jsonify({'message': 'Cart item not found'}), 404

    if quantity == 0:
        db.session.delete(cart_item)
    else:
        cart_item.quantity = quantity
    
    db.session.commit()
    return jsonify(cart_item.cart.to_dict_with_items()), 200

@cart_bp.route('/items/<int:item_id>', methods=['DELETE', 'OPTIONS'])
@handle_options_request
def remove_from_cart(item_id):
    if request.method == 'OPTIONS':
        return make_response()
        
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"message": "Authentication required"}), 401
            
        cart_item = CartItem.query.get(item_id)
    except Exception as e:
        return jsonify({"message": f"Error processing request: {str(e)}"}), 400

    if not cart_item or cart_item.cart.user_id != user_id:
        return jsonify({'message': 'Cart item not found'}), 404

    cart = cart_item.cart
    db.session.delete(cart_item)
    db.session.commit()
    return jsonify(cart.to_dict_with_items()), 200
