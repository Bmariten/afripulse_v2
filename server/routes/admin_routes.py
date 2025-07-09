from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.product import Product
from models.order import Order
from models.flagged_activity import FlaggedActivity
from models.affiliate_profile import AffiliateProfile
from models.affiliate_click import AffiliateClick
from models.affiliate_link import AffiliateLink
from models.profile import Profile
from utils.auth_helpers import admin_required
import logging

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_dashboard():
    try:
        user_count = User.query.count()
        product_count = Product.query.count()
        order_count = Order.query.count()
        return jsonify({
            'user_count': user_count,
            'product_count': product_count,
            'order_count': order_count
        }), 200
    except Exception as e:
        logger.error(f"Error in admin dashboard: {str(e)}")
        return jsonify({'message': str(e)}), 500
        
@admin_bp.route('/flagged-items', methods=['GET'])
@jwt_required()
@admin_required
def get_flagged_items():
    try:
        # Get all flagged activities
        flagged_activities = FlaggedActivity.query.order_by(FlaggedActivity.created_at.desc()).all()
        
        # Format the response
        result = []
        for activity in flagged_activities:
            user = User.query.get(activity.user_id)
            user_name = user.profile.name if user and user.profile else 'Unknown User'
            
            item = {
                'id': activity.id,
                'itemType': activity.activity_type,
                'name': f"{activity.activity_type.capitalize()} by {user_name}",
                'reason': activity.description,
                'reportedBy': 'System',  # Could be updated if you track who reported
                'reportDate': activity.created_at.isoformat(),
                'status': activity.status,
                'ip_address': activity.ip_address,
                'user_agent': activity.user_agent,
                'resolution_notes': activity.resolution_notes,
                'reviewed_by': activity.reviewed_by,
                'updated_at': activity.updated_at.isoformat() if activity.updated_at else None
            }
            result.append(item)
        
        # Return empty list if no real data exists
        # This ensures the admin sees the actual state of the database
            
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching flagged items: {str(e)}")
        return jsonify({'message': f'Error fetching flagged items: {str(e)}'}), 500
        
@admin_bp.route('/flagged-items/<string:item_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_flagged_item(item_id):
    try:
        data = request.get_json()
        flagged_activity = FlaggedActivity.query.get(item_id)
        
        if not flagged_activity:
            return jsonify({'message': 'Flagged item not found'}), 404
            
        # Update status and resolution notes
        if 'status' in data:
            flagged_activity.status = data['status']
            
        if 'resolution_notes' in data:
            flagged_activity.resolution_notes = data['resolution_notes']
            
        # Set the reviewer
        flagged_activity.reviewed_by = get_jwt_identity()
        
        # Save changes
        from models import db
        db.session.commit()
        
        return jsonify(flagged_activity.to_dict()), 200
    except Exception as e:
        logger.error(f"Error updating flagged item: {str(e)}")
        return jsonify({'message': f'Error updating flagged item: {str(e)}'}), 500

@admin_bp.route('/sellers', methods=['GET'])
@jwt_required()
@admin_required
def get_all_sellers():
    try:
        # Get all seller profiles with user information
        from models.seller_profile import SellerProfile
        from models.profile import Profile
        
        sellers = db.session.query(
            SellerProfile.id,
            Profile.name
        ).join(
            User, SellerProfile.user_id == User.id
        ).join(
            Profile, User.id == Profile.user_id
        ).all()
        
        result = []
        for seller_id, name in sellers:
            result.append({
                'id': seller_id,
                'name': name or 'Unknown Seller'
            })
            
        # If no sellers found, return empty list
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching sellers: {str(e)}")
        return jsonify({'message': f'Error fetching sellers: {str(e)}'}), 500
        
@admin_bp.route('/affiliates', methods=['GET'])
@jwt_required()
@admin_required
def get_all_affiliates():
    try:
        # Simplified query to get all affiliates with basic info
        affiliates_query = db.session.query(
            User.id.label('user_id'),
            AffiliateProfile.id.label('affiliate_id'),
            Profile.name,
            User.email,
            User.is_profile_complete.label('is_active'),
            AffiliateProfile.created_at
        ).join(
            AffiliateProfile, User.id == AffiliateProfile.user_id
        ).join(
            Profile, User.id == Profile.user_id
        ).filter(
            User.role == 'affiliate'
        ).all()
        
        # Get affiliate links for each affiliate
        result = []
        for user_id, affiliate_id, name, email, is_active, created_at in affiliates_query:
            # Get affiliate stats from AffiliateLink table
            affiliate_stats = db.session.query(
                db.func.sum(AffiliateLink.clicks).label('total_clicks'),
                db.func.sum(AffiliateLink.conversions).label('total_sales'),
                db.func.sum(AffiliateLink.earnings).label('total_commissions')
            ).filter(
                AffiliateLink.affiliate_id == affiliate_id
            ).first()
            
            # Determine status based on is_active
            status = 'active' if is_active else 'pending'
            
            # Extract stats with fallbacks to 0
            clicks = affiliate_stats.total_clicks or 0 if affiliate_stats.total_clicks is not None else 0
            sales = affiliate_stats.total_sales or 0 if affiliate_stats.total_sales is not None else 0
            commissions = affiliate_stats.total_commissions or 0.0 if affiliate_stats.total_commissions is not None else 0.0
            result.append({
                'id': affiliate_id,
                'user_id': user_id,
                'name': name or 'Unknown Affiliate',
                'email': email,
                'status': status,
                'joinDate': created_at.isoformat() if created_at else None,
                'clicks': clicks,
                'sales': sales,
                'commissions': float(commissions)
            })
        
        # Return empty list if no real data exists
        # This ensures the admin sees the actual state of the database
            
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching affiliates: {str(e)}")
        return jsonify({'message': f'Error fetching affiliates: {str(e)}'}), 500


@admin_bp.route('/affiliates/<affiliate_id>/activate', methods=['PUT'])
@jwt_required()
@admin_required
def activate_affiliate(affiliate_id):
    try:
        # Find the affiliate profile
        affiliate_profile = AffiliateProfile.query.filter_by(id=affiliate_id).first()
        if not affiliate_profile:
            return jsonify({'message': 'Affiliate profile not found'}), 404
            
        # Find the user associated with this affiliate profile
        user = User.query.filter_by(id=affiliate_profile.user_id).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Update the user's profile completion status
        user.is_profile_complete = True
        db.session.commit()
        
        logger.info(f"Admin activated affiliate {affiliate_id}")
        return jsonify({'message': 'Affiliate activated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error activating affiliate: {str(e)}")
        return jsonify({'message': f'Error activating affiliate: {str(e)}'}), 500
