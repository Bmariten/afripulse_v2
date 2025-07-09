from flask import Blueprint, request, jsonify

from models.search import search_products, search_sellers

search_bp = Blueprint('search', __name__)

@search_bp.route('/products', methods=['GET'])
def search_products_route():
    """Search for products"""
    try:
        # Get query parameters
        query = request.args.get('q', '')
        category = request.args.get('category')
        subcategory = request.args.get('subcategory')
        price_min = request.args.get('price_min', type=float)
        price_max = request.args.get('price_max', type=float)
        seller_id = request.args.get('seller_id')
        featured = request.args.get('featured', type=bool)
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Build filters
        filters = {
            'category': category,
            'subcategory': subcategory,
            'price_min': price_min,
            'price_max': price_max,
            'seller_id': seller_id,
            'featured': featured,
            'sort_by': sort_by,
            'sort_order': sort_order
        }
        
        # Remove None values
        filters = {k: v for k, v in filters.items() if v is not None}
        
        # Search products
        products, total = search_products(query, filters, limit, offset)
        
        return jsonify({
            'products': [product.to_dict() for product in products],
            'total': total,
            'query': query,
            'filters': filters
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error searching products: {str(e)}'}), 500

@search_bp.route('/sellers', methods=['GET'])
def search_sellers_route():
    """Search for sellers"""
    try:
        # Get query parameters
        query = request.args.get('q', '')
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Search sellers
        sellers, total = search_sellers(query, limit, offset)
        
        return jsonify({
            'sellers': sellers,
            'total': total,
            'query': query
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error searching sellers: {str(e)}'}), 500
