from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from models import User

def role_required(role):
    """
    Decorator to check if user has a specific role
    Usage: @role_required('admin') or @role_required(['admin', 'seller'])
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
                
            if isinstance(role, list):
                if user.role not in role:
                    return jsonify({'message': f'Access denied. Required roles: {", ".join(role)}'}), 403
            else:
                if user.role != role:
                    return jsonify({'message': f'Access denied. Required role: {role}'}), 403
                    
            return fn(*args, **kwargs)
        return wrapper
    return decorator
