from flask import Blueprint, request, jsonify, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from models import db, AffiliateLink, Product, User
from utils.auth_helpers import affiliate_required
import uuid
import logging

affiliate_bp = Blueprint('affiliate_bp', __name__, url_prefix='/api/affiliate')
logger = logging.getLogger(__name__)

# Endpoint for affiliates to generate a unique tracking link for a product
@affiliate_bp.route('/links', methods=['POST'])
@jwt_required()
@affiliate_required
def generate_affiliate_link():
    data = request.get_json()
    product_id = data.get('product_id')
    user_id = get_jwt_identity()

    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # Check if a link already exists for this user and product
    existing_link = AffiliateLink.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing_link:
        return jsonify({'message': 'Affiliate link already exists', 'link': f'http://localhost:5000/api/affiliate/track/{existing_link.code}'}), 200

    code = str(uuid.uuid4())[:8]
    
    # Get the affiliate profile ID for this user
    user = User.query.get(user_id)
    affiliate_profile = user.affiliate_profile
    if not affiliate_profile:
        return jsonify({'message': 'Affiliate profile not found'}), 404
        
    # Get the commission rate from the product or use a default
    commission_rate = product.commission_rate if hasattr(product, 'commission_rate') and product.commission_rate else 5.0
    
    new_link = AffiliateLink(
        user_id=user_id,
        affiliate_id=affiliate_profile.id,
        product_id=product_id,
        code=code,
        commission_rate=commission_rate
    )
    db.session.add(new_link)
    db.session.commit()

    # The full URL should ideally use config for the domain
    full_link = f'http://localhost:5000/api/affiliate/track/{code}'

    return jsonify({'message': 'Affiliate link created successfully', 'link': full_link}), 201

# Endpoint to get dashboard statistics for the logged-in affiliate
@affiliate_bp.route('/dashboard-stats', methods=['GET'])
@jwt_required()
@affiliate_required
def get_dashboard_stats():
    user_id = get_jwt_identity()
    try:
        # Corrected query: Filter by user_id on the AffiliateLink model directly
        stats = db.session.query(
            func.sum(AffiliateLink.clicks).label('total_clicks'),
            func.sum(AffiliateLink.conversions).label('total_conversions'),
            func.sum(AffiliateLink.earnings).label('total_earnings'),
            func.count(AffiliateLink.id).label('total_links')
        ).filter(AffiliateLink.user_id == user_id).one()

        response = {
            'total_clicks': stats.total_clicks or 0,
            'total_conversions': stats.total_conversions or 0,
            'total_earnings': float(stats.total_earnings or 0.0),
            'total_links': stats.total_links or 0
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching dashboard stats: {str(e)}'}), 500

# Endpoint to get performance of individual links
@affiliate_bp.route('/link-performance', methods=['GET'])
@jwt_required()
@affiliate_required
def get_link_performance():
    user_id = get_jwt_identity()
    links = AffiliateLink.query.filter_by(user_id=user_id).all()
    return jsonify([link.to_dict() for link in links]), 200

# Endpoint to get all affiliate links for the logged-in user
@affiliate_bp.route('/links', methods=['GET'])
@jwt_required()
@affiliate_required
def get_affiliate_links():
    user_id = get_jwt_identity()
    logger.info(f"Fetching affiliate links for user {user_id}")
    
    try:
        # Get all links for this affiliate
        links = AffiliateLink.query.filter_by(user_id=user_id).all()
        
        # Format the response with product details
        result = []
        for link in links:
            product = Product.query.get(link.product_id)
            if product:
                link_data = link.to_dict()
                link_data['product_name'] = product.name
                link_data['product_image'] = product.image_url if hasattr(product, 'image_url') else None
                link_data['full_url'] = f'http://localhost:5000/api/affiliate/track/{link.code}'
                result.append(link_data)
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching affiliate links: {str(e)}")
        return jsonify({'message': f'Error fetching affiliate links: {str(e)}'}), 500

# Public-facing tracking endpoint
@affiliate_bp.route('/track/<code>', methods=['GET'])
def track_link_click(code):
    link = AffiliateLink.query.filter_by(code=code).first()
    if not link:
        return jsonify({'message': 'Invalid tracking link'}), 404

    link.clicks += 1
    db.session.commit()

    product = Product.query.get(link.product_id)
    if not product:
        return jsonify({'message': 'Associated product not found'}), 404

    # Redirect to the frontend product page
    # The frontend URL should ideally come from a config
    frontend_url = f'http://localhost:8080/products/{product.slug}'
    return redirect(frontend_url)

# Endpoint to update affiliate profile
@affiliate_bp.route('/profile', methods=['PUT'])
@jwt_required()
@affiliate_required
def update_affiliate_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Get the user and their affiliate profile
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    affiliate_profile = user.affiliate_profile
    if not affiliate_profile:
        return jsonify({'message': 'Affiliate profile not found'}), 404
    
    # Update affiliate profile fields
    if data.get('website') is not None:
        affiliate_profile.website = data['website']
    if data.get('social_media') is not None:
        affiliate_profile.social_media = data['social_media']
    if data.get('niche') is not None:
        affiliate_profile.niche = data['niche']
    if data.get('paypal_email') is not None:
        affiliate_profile.paypal_email = data['paypal_email']
    if data.get('bank_account') is not None:
        affiliate_profile.bank_account = data['bank_account']
    
    # Save changes
    db.session.commit()
    
    # Return the updated user data with full profile information
    user_data = user.to_dict()
    
    # Add profile data if it exists
    if user.profile:
        user_data['profile'] = user.profile.to_dict()
    
    # Add affiliate profile since user is an affiliate
    if user.affiliate_profile:
        user_data['affiliate_profile'] = user.affiliate_profile.to_dict()
    
    return jsonify(user_data), 200
