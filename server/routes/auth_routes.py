from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
import bcrypt
import uuid
from datetime import datetime, timedelta
import os

from models import db, User, Profile, TokenBlocklist
from utils.email_service import send_verification_email, send_password_reset_email
from utils.validators import validate_email, validate_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'customer')  # Default to customer if not specified
    
    # Validate email format
    if not validate_email(email):
        return jsonify({'message': 'Invalid email format'}), 400
    
    # Validate password strength
    if not validate_password(password):
        return jsonify({'message': 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409
    
    try:
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Generate verification token
        verification_token = str(uuid.uuid4())
        
        # Create new user
        new_user = User(
            id=str(uuid.uuid4()),
            email=email,
            password=hashed_password,
            role=role,
            email_verification_token=verification_token
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Create profile with name
        profile = Profile(
            id=str(uuid.uuid4()),
            user_id=new_user.id,
            name=data.get('name') # Get name from request
        )
        
        db.session.add(profile)
        db.session.commit()
        
        # Send verification email
        send_verification_email(email, verification_token)
        
        return jsonify({
            'message': 'User registered successfully. Please check your email to verify your account.',
            'userId': new_user.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    try:
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Check if email is verified
        if not user.is_email_verified:
            return jsonify({'message': 'Please verify your email before logging in'}), 403
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/verify-email', methods=['GET'])
def verify_email():
    token = request.args.get('token')
    
    if not token:
        return jsonify({'message': 'Verification token is required'}), 400
    
    try:
        user = User.query.filter_by(email_verification_token=token).first()
        
        if not user:
            return jsonify({'message': 'Invalid verification token'}), 400
        
        # Mark email as verified
        user.is_email_verified = True
        user.email_verification_token = None
        
        db.session.commit()
        
        return jsonify({'message': 'Email verified successfully. You can now log in.'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Email verification failed: {str(e)}'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    
    if not data or not data.get('email'):
        return jsonify({'message': 'Email is required'}), 400
    
    email = data.get('email')
    
    try:
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Don't reveal that the user doesn't exist for security reasons
            return jsonify({'message': 'If your email is registered, you will receive a password reset link'}), 200
        
        # Generate reset token
        reset_token = str(uuid.uuid4())
        
        # Set token and expiry (24 hours)
        user.password_reset_token = reset_token
        user.password_reset_expires = datetime.utcnow() + timedelta(hours=24)
        
        db.session.commit()
        
        # Send password reset email
        send_password_reset_email(email, reset_token)
        
        return jsonify({'message': 'Password reset link sent to your email'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to process request: {str(e)}'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    
    if not data or not data.get('token') or not data.get('password'):
        return jsonify({'message': 'Token and new password are required'}), 400
    
    token = data.get('token')
    password = data.get('password')
    
    # Validate password strength
    if not validate_password(password):
        return jsonify({'message': 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'}), 400
    
    try:
        user = User.query.filter_by(password_reset_token=token).first()
        
        if not user:
            return jsonify({'message': 'Invalid or expired reset token'}), 400
        
        # Check if token is expired
        if not user.password_reset_expires or user.password_reset_expires < datetime.utcnow():
            return jsonify({'message': 'Reset token has expired'}), 400
        
        # Hash new password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Update password and clear reset token
        user.password = hashed_password
        user.password_reset_token = None
        user.password_reset_expires = None
        
        db.session.commit()
        
        return jsonify({'message': 'Password reset successful. You can now log in with your new password.'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Password reset failed: {str(e)}'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Revoke the current user's access token"""
    try:
        jti = get_jwt()['jti']
        blocklist_entry = TokenBlocklist(jti=jti)
        db.session.add(blocklist_entry)
        db.session.commit()
        return jsonify({'message': 'Successfully logged out'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Logout failed: {str(e)}'}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    
    try:
        # Generate new access token
        access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Token refresh failed: {str(e)}'}), 500
