from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.user import User
from models.product import Product
from models.order import Order
from models.order_item import OrderItem
from models.flagged_activity import FlaggedActivity
from models.affiliate_profile import AffiliateProfile
from models.affiliate_click import AffiliateClick
from models.affiliate_link import AffiliateLink
from models.profile import Profile
from models.seller_profile import SellerProfile
from models.category import Category
from utils.auth_helpers import admin_required
import logging
from datetime import datetime, timedelta
from sqlalchemy import func, desc

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

@admin_bp.route('/products', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_products():
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', None)
        category_id = request.args.get('category_id', None)
        search_term = request.args.get('search', None)
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        # Start with base query
        query = Product.query
        
        # Apply filters
        if status:
            if status == 'active':
                query = query.filter(Product.status == 'active')
            elif status == 'inactive':
                query = query.filter(Product.status == 'inactive')
            elif status == 'pending':
                query = query.filter(Product.is_approved == False)
        
        if category_id:
            query = query.filter(Product.category_id == category_id)
        
        if search_term:
            query = query.filter(Product.name.ilike(f'%{search_term}%'))
        
        # Apply sorting
        if sort_by == 'price':
            if sort_order == 'asc':
                query = query.order_by(Product.price.asc())
            else:
                query = query.order_by(Product.price.desc())
        elif sort_by == 'created_at':
            if sort_order == 'asc':
                query = query.order_by(Product.created_at.asc())
            else:
                query = query.order_by(Product.created_at.desc())
        elif sort_by == 'name':
            if sort_order == 'asc':
                query = query.order_by(Product.name.asc())
            else:
                query = query.order_by(Product.name.desc())
        
        # Paginate results
        paginated_products = query.paginate(page=page, per_page=per_page, error_out=False)
        
        # Get categories for filter options
        categories = Category.query.all()
        category_options = [{'id': cat.id, 'name': cat.name} for cat in categories]
        
        # Count products by status for summary
        total_products = Product.query.count()
        active_products = Product.query.filter_by(status='active').count()
        pending_products = Product.query.filter_by(is_approved=False).count()
        
        return jsonify({
            'products': [product.to_dict() for product in paginated_products.items],
            'pagination': {
                'total_items': paginated_products.total,
                'per_page': per_page,
                'current_page': page,
                'total_pages': paginated_products.pages
            },
            'filters': {
                'categories': category_options,
                'statuses': ['all', 'active', 'inactive', 'pending']
            },
            'summary': {
                'total': total_products,
                'active': active_products,
                'pending': pending_products,
                'inactive': total_products - active_products
            }
        }), 200
    except Exception as e:
        logger.error(f"Error fetching admin products: {str(e)}")
        return jsonify({'message': 'Failed to fetch products'}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_admin_users():
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        role = request.args.get('role', None)
        search_term = request.args.get('search', None)
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        # Start with base query
        query = User.query
        
        # Apply filters
        if role and role != 'all':
            query = query.filter(User.role == role)
        
        if search_term:
            query = query.filter(
                (User.email.ilike(f'%{search_term}%')) | 
                (User.first_name.ilike(f'%{search_term}%')) | 
                (User.last_name.ilike(f'%{search_term}%'))
            )
        
        # Apply sorting
        if sort_by == 'email':
            if sort_order == 'asc':
                query = query.order_by(User.email.asc())
            else:
                query = query.order_by(User.email.desc())
        elif sort_by == 'created_at':
            if sort_order == 'asc':
                query = query.order_by(User.created_at.asc())
            else:
                query = query.order_by(User.created_at.desc())
        elif sort_by == 'name':
            if sort_order == 'asc':
                query = query.order_by(User.first_name.asc())
            else:
                query = query.order_by(User.first_name.desc())
        
        # Paginate results
        paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)
        
        # Count users by role for summary
        total_users = User.query.count()
        admin_users = User.query.filter_by(role='admin').count()
        seller_users = User.query.filter_by(role='seller').count()
        affiliate_users = User.query.filter_by(role='affiliate').count()
        customer_users = User.query.filter_by(role='customer').count()
        
        return jsonify({
            'users': [user.to_dict() for user in paginated_users.items],
            'pagination': {
                'total_items': paginated_users.total,
                'per_page': per_page,
                'current_page': page,
                'total_pages': paginated_users.pages
            },
            'filters': {
                'roles': ['all', 'admin', 'seller', 'affiliate', 'customer']
            },
            'summary': {
                'total': total_users,
                'admin': admin_users,
                'seller': seller_users,
                'affiliate': affiliate_users,
                'customer': customer_users
            }
        }), 200
    except Exception as e:
        logger.error(f"Error fetching admin users: {str(e)}")
        return jsonify({'message': 'Failed to fetch users'}), 500

@admin_bp.route('/reports/sales', methods=['GET'])
@jwt_required()
@admin_required
def get_sales_reports():
    try:
        # Get query parameters
        period = request.args.get('period', 'week')  # week, month, year
        
        # Calculate date ranges
        today = datetime.now().date()
        if period == 'week':
            start_date = today - timedelta(days=7)
            date_format = '%Y-%m-%d'
            group_by = func.date(Order.created_at)
        elif period == 'month':
            start_date = today - timedelta(days=30)
            date_format = '%Y-%m-%d'
            group_by = func.date(Order.created_at)
        else:  # year
            start_date = today - timedelta(days=365)
            date_format = '%Y-%m'
            group_by = func.strftime('%Y-%m', Order.created_at)
        
        # Get sales data grouped by date
        sales_data = db.session.query(
            group_by.label('date'),
            func.sum(Order.total_amount).label('total_sales'),
            func.count(Order.id).label('order_count')
        ).filter(
            Order.created_at >= start_date
        ).group_by(
            'date'
        ).order_by(
            desc('date')
        ).all()
        
        # Format results
        formatted_data = [{
            'date': item.date.strftime(date_format) if hasattr(item.date, 'strftime') else item.date,
            'total_sales': float(item.total_sales) if item.total_sales else 0,
            'order_count': item.order_count
        } for item in sales_data]
        
        # Get top selling products
        top_products = db.session.query(
            Product.id,
            Product.name,
            func.sum(OrderItem.quantity).label('total_sold'),
            func.sum(OrderItem.price_per_unit * OrderItem.quantity).label('total_revenue')
        ).join(
            OrderItem, OrderItem.product_id == Product.id
        ).group_by(
            Product.id
        ).order_by(
            desc('total_sold')
        ).limit(5).all()
        
        top_products_data = [{
            'id': item.id,
            'name': item.name,
            'total_sold': item.total_sold,
            'total_revenue': float(item.total_revenue) if item.total_revenue else 0
        } for item in top_products]
        
        # Get sales by category
        sales_by_category = db.session.query(
            Category.name,
            func.sum(OrderItem.quantity).label('total_sold'),
            func.sum(OrderItem.price_per_unit * OrderItem.quantity).label('total_revenue')
        ).join(
            Product, Product.id == OrderItem.product_id
        ).join(
            Category, Category.id == Product.category_id
        ).join(
            Order, Order.id == OrderItem.order_id
        ).filter(
            Order.created_at >= start_date
        ).group_by(
            Category.name
        ).order_by(
            desc('total_revenue')
        ).all()
        
        category_data = [{
            'name': item.name,
            'total_sold': item.total_sold,
            'total_revenue': float(item.total_revenue) if item.total_revenue else 0
        } for item in sales_by_category]
        
        # Calculate summary metrics
        total_sales = sum(item['total_sales'] for item in formatted_data)
        total_orders = sum(item['order_count'] for item in formatted_data)
        avg_order_value = total_sales / total_orders if total_orders > 0 else 0
        
        return jsonify({
            'sales_over_time': formatted_data,
            'top_products': top_products_data,
            'sales_by_category': category_data,
            'summary': {
                'total_sales': total_sales,
                'total_orders': total_orders,
                'avg_order_value': avg_order_value,
                'period': period
            }
        }), 200
    except Exception as e:
        logger.error(f"Error generating sales report: {str(e)}")
        return jsonify({'message': 'Failed to generate sales report'}), 500
