from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import uuid
import logging
from werkzeug.utils import secure_filename

from models import db
from models.user import User
from models.profile import Profile
from models.seller_profile import SellerProfile
from models.affiliate_profile import AffiliateProfile
from models.product import Product
from models.order import Order

logger = logging.getLogger(__name__)

profile_bp = Blueprint('profile_bp', __name__, url_prefix='/api/profile')

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.profile:
        return jsonify({'message': 'Profile not found'}), 404
    return jsonify(user.profile.to_dict_full()), 200

@profile_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Get the full user object with all related profiles
    user_data = user.to_dict()
    
    # Add profile data if it exists
    profile = user.profile
    if profile:
        user_data['profile'] = profile.to_dict()
    
    # Add seller profile if it exists and user is a seller
    if user.role == 'seller':
        seller_profile = user.seller_profile
        if seller_profile:
            user_data['seller_profile'] = seller_profile.to_dict()
    
    # Add affiliate profile if it exists and user is an affiliate
    if user.role == 'affiliate':
        affiliate_profile = user.affiliate_profile
        if affiliate_profile:
            user_data['affiliate_profile'] = affiliate_profile.to_dict()
    
    return jsonify(user_data), 200

@profile_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_user_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Update profile data if it exists and profile data is provided
    if 'profile' in data and user.profile:
        profile_data = data['profile']
        profile = user.profile
        
        # Update profile fields
        for key, value in profile_data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
    
    # Update seller profile if user is a seller and seller data is provided
    if user.role == 'seller' and 'seller_profile' in data and user.seller_profile:
        seller_data = data['seller_profile']
        seller_profile = user.seller_profile
        
        for key, value in seller_data.items():
            if hasattr(seller_profile, key):
                setattr(seller_profile, key, value)
    
    # Update affiliate profile if user is an affiliate and affiliate data is provided
    if user.role == 'affiliate' and 'affiliate_profile' in data and user.affiliate_profile:
        affiliate_data = data['affiliate_profile']
        affiliate_profile = user.affiliate_profile
        
        for key, value in affiliate_data.items():
            if hasattr(affiliate_profile, key):
                setattr(affiliate_profile, key, value)
    
    db.session.commit()
    
    # Return the updated user data with full profile information
    user_data = user.to_dict()
    
    # Add profile data if it exists
    if user.profile:
        user_data['profile'] = user.profile.to_dict()
    
    # Add seller profile if it exists and user is a seller
    if user.role == 'seller' and user.seller_profile:
        user_data['seller_profile'] = user.seller_profile.to_dict()
    
    # Add affiliate profile if it exists and user is an affiliate
    if user.role == 'affiliate' and user.affiliate_profile:
        user_data['affiliate_profile'] = user.affiliate_profile.to_dict()
    
    return jsonify(user_data), 200

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.form
    user = User.query.get(user_id)

    if not user.profile:
        return jsonify({'message': 'Profile not found'}), 404

    profile = user.profile
    profile.name = data.get('name', profile.name)
    profile.bio = data.get('bio', profile.bio)

    if 'avatar' in request.files:
        file = request.files['avatar']
        if file and file.filename:
            try:
                # Create uploads directory if it doesn't exist
                uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'uploads', 'avatars')
                os.makedirs(uploads_dir, exist_ok=True)
                
                # Generate a unique filename
                filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4()}_{filename}"
                file_path = os.path.join(uploads_dir, unique_filename)
                
                # Save the file
                file.save(file_path)
                
                # Set the avatar URL to be relative to the server
                avatar_url = f"/uploads/avatars/{unique_filename}"
                profile.avatar = avatar_url
            except Exception as e:
                return jsonify({'message': f'Failed to upload avatar: {str(e)}'}), 500

    db.session.commit()
    return jsonify(profile.to_dict_full()), 200

@profile_bp.route('/seller', methods=['PUT'])
@jwt_required()
def update_seller_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    profile = SellerProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({'message': 'Seller profile not found'}), 404

    for key, value in data.items():
        if hasattr(profile, key):
            setattr(profile, key, value)

    db.session.commit()
    return jsonify(profile.user.profile.to_dict_full()), 200

@profile_bp.route('/affiliate', methods=['PUT'])
@jwt_required()
def update_affiliate_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    user = User.query.get(user_id)
    if not user or user.role != 'affiliate':
        return jsonify({'message': 'User not found or not an affiliate'}), 404
    
    affiliate_profile = user.affiliate_profile
    if not affiliate_profile:
        return jsonify({'message': 'Affiliate profile not found'}), 404
    
    for key, value in data.items():
        if hasattr(affiliate_profile, key):
            setattr(affiliate_profile, key, value)
    
    db.session.commit()
    return jsonify(affiliate_profile.to_dict()), 200

@profile_bp.route('/dashboard-stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    try:
        # Different stats based on user role
        if user.role == 'admin':
            # Admin sees platform-wide stats
            total_sellers = User.query.filter_by(role='seller').count()
            total_products = Product.query.count()
            total_affiliates = User.query.filter_by(role='affiliate').count()
            total_revenue = db.session.query(db.func.sum(Order.total_amount)).scalar() or 0
            
            # Additional stats for enhanced dashboard
            active_listings = Product.query.filter_by(status='active').count()
            
            # Calculate conversion rate (orders / product views)
            # This is a simplified example - in a real app, you'd track actual views
            total_orders = Order.query.count()
            # Assuming we have 10x more views than orders as a placeholder
            estimated_views = total_orders * 10 if total_orders > 0 else 1
            conversion_rate = round((total_orders / estimated_views) * 100, 2) if estimated_views > 0 else 0
            
            return jsonify({
                'totalSellers': total_sellers,
                'totalProducts': total_products,
                'totalAffiliates': total_affiliates,
                'totalRevenue': float(total_revenue),
                'activeListings': active_listings,
                'conversionRate': conversion_rate
            }), 200
        elif user.role == 'seller':
            # Redirect to seller stats endpoint
            return jsonify({'message': 'Please use the seller dashboard stats endpoint'}), 307
        elif user.role == 'affiliate':
            # Redirect to affiliate stats endpoint
            return jsonify({'message': 'Please use the affiliate dashboard stats endpoint'}), 307
        else:
            # Regular users don't have dashboard stats
            return jsonify({'message': 'No dashboard stats available for this user role'}), 404
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {str(e)}")
        return jsonify({'message': f'Error fetching dashboard stats: {str(e)}'}), 500
