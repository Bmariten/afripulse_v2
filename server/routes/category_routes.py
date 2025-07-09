from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from models import db, Category, Product
from utils.auth_helpers import admin_required

category_bp = Blueprint('category', __name__)

@category_bp.route('/', methods=['GET'])
def get_all_categories():
    """Get all product categories"""
    try:
        # Get distinct categories from products
        categories = db.session.query(Category).join(Product).filter(
            Product.status == 'active'
        ).distinct().all()
        
        # Extract category names
        category_list = [category.name for category in categories if category and category.name]
        
        # Create a list of category objects with name and slug
        formatted_categories = []
        for name in category_list:
            slug = name.lower().replace(' ', '-')
            formatted_categories.append({
                'name': name,
                'slug': slug,
                'description': f'Products in the {name} category',
                'image_url': 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            })
        
        return jsonify(formatted_categories), 200
        
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"\n\nERROR in get_all_categories: {e}\n{error_traceback}\n\n")
        return jsonify({'message': f'Error fetching categories: {str(e)}'}), 500

@category_bp.route('/<category>/subcategories', methods=['GET'])
def get_subcategories(category):
    """Get subcategories for a specific category"""
    try:
        # Get distinct subcategories for the given category
        subcategories = db.session.query(Category).join(Product).filter(
            Category.name == category,
            Product.status == 'active',
            Category.parent_id.isnot(None)
        ).distinct().all()
        
        # Extract subcategory names
        subcategory_list = [sub.name for sub in subcategories if sub and sub.name]
        
        return jsonify(subcategory_list), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching subcategories: {str(e)}'}), 500

@category_bp.route('/featured', methods=['GET'])
def get_featured_categories():
    """Get categories with featured products"""
    try:
        # Get categories that have featured products
        featured_categories = db.session.query(Category).join(Product).filter(
            Product.featured == True,
            Product.status == 'active'
        ).distinct().all()
        
        # Extract category names
        category_list = [category.name for category in featured_categories if category and category.name]
        
        # Create a list of category objects with name and slug
        formatted_categories = []
        for name in category_list:
            slug = name.lower().replace(' ', '-')
            formatted_categories.append({
                'name': name,
                'slug': slug,
                'description': f'Featured products in the {name} category',
                'image_url': 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            })
        
        return jsonify(formatted_categories), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching featured categories: {str(e)}'}), 500

@category_bp.route('/<category>/products', methods=['GET'])
def get_products_by_category(category):
    """Get products by category"""
    try:
        # Get query parameters
        subcategory = request.args.get('subcategory')
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Base query
        query = Product.query.filter_by(category=category, status='active')
        
        # Apply subcategory filter if provided
        if subcategory:
            query = query.filter_by(subcategory=subcategory)
        
        # Get total count
        total = query.count()
        
        # Get products with pagination
        products = query.order_by(Product.created_at.desc()).offset(offset).limit(limit).all()
        
        return jsonify({
            'products': [product.to_dict() for product in products],
            'total': total,
            'category': category,
            'subcategory': subcategory if subcategory else None
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching products by category: {str(e)}'}), 500
