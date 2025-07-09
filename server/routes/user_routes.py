from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import bcrypt
import uuid

from models import db, User, Profile
from utils.auth_helpers import admin_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users():
    """Get all users (admin only)"""
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching users: {str(e)}'}), 500


@user_bp.route('/admin/affiliates', methods=['GET'])
@jwt_required()
@admin_required
def get_all_affiliates():
    """Get all affiliate users (admin only)"""
    try:
        affiliates = User.query.filter_by(role='affiliate').all()
        return jsonify([affiliate.to_dict() for affiliate in affiliates]), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching affiliates: {str(e)}'}), 500

@user_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get a user by ID"""
    current_user_id = get_jwt_identity()
    
    try:
        # Check if the user is requesting their own data or is an admin
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        current_user = User.query.get(current_user_id)
        
        # Only allow users to access their own data or admins to access any data
        if current_user_id != user_id and current_user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching user: {str(e)}'}), 500

@user_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update a user"""
    current_user_id = get_jwt_identity()
    data = request.json
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    try:
        # Check if the user is updating their own data or is an admin
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'message': 'Current user not found'}), 404
        
        if current_user_id != user_id and current_user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Update user fields
        if 'email' in data and data['email'] != user.email:
            # Check if email is already taken
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'message': 'Email already in use'}), 409
            user.email = data['email']
        
        if 'password' in data and data['password']:
            # Hash new password
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user.password = hashed_password
        
        # Only admins can update role
        if 'role' in data and current_user.role == 'admin':
            user.role = data['role']
        
        db.session.commit()
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating user: {str(e)}'}), 500

@user_bp.route('/<user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(user_id):
    """Delete a user (admin only)"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error deleting user: {str(e)}'}), 500
