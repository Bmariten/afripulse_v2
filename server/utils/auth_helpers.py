from functools import wraps
from flask import jsonify, g
from flask_jwt_extended import get_jwt_identity

from models import User, Profile

def admin_required(fn):
    """Decorator to check if user is an admin"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        
        return fn(*args, **kwargs)
    return wrapper

def seller_required(fn):
    """Decorator to check if user is a seller and attach their profile to g."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'seller':
            return jsonify({'message': 'Seller access required'}), 403

        seller_profile = Profile.query.filter_by(user_id=user_id).first()
        if not seller_profile:
            # This case might happen if a user has the 'seller' role but their profile is incomplete or deleted.
            return jsonify({'message': 'Seller profile not found.'}), 404

        g.seller_profile = seller_profile
        
        return fn(*args, **kwargs)
    return wrapper

def affiliate_required(f):
    """Decorator to check if user is an affiliate"""
    @wraps(f)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'affiliate':
            return jsonify({'message': 'Affiliate access required'}), 403
            
        return f(*args, **kwargs)
    return wrapper
