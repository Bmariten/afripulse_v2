from sqlalchemy import or_, and_, func
from models import db, Product, User, Profile, SellerProfile

def search_products(query_text, filters=None, limit=20, offset=0):
    """
    Search products by name, description, or category
    
    Args:
        query_text (str): Search query
        filters (dict): Optional filters like category, price_min, price_max, etc.
        limit (int): Number of results to return
        offset (int): Offset for pagination
        
    Returns:
        tuple: (products, total_count)
    """
    # Base query
    query = Product.query.filter_by(status='active')
    
    # Apply search
    if query_text:
        search_term = f"%{query_text}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.category.ilike(search_term),
                Product.subcategory.ilike(search_term)
            )
        )
    
    # Apply filters
    if filters:
        if filters.get('category'):
            query = query.filter(Product.category == filters['category'])
        
        if filters.get('subcategory'):
            query = query.filter(Product.subcategory == filters['subcategory'])
        
        if filters.get('price_min') is not None:
            query = query.filter(
                or_(
                    and_(Product.sale_price.isnot(None), Product.sale_price >= filters['price_min']),
                    and_(Product.sale_price.is_(None), Product.price >= filters['price_min'])
                )
            )
        
        if filters.get('price_max') is not None:
            query = query.filter(
                or_(
                    and_(Product.sale_price.isnot(None), Product.sale_price <= filters['price_max']),
                    and_(Product.sale_price.is_(None), Product.price <= filters['price_max'])
                )
            )
        
        if filters.get('seller_id'):
            query = query.filter(Product.seller_id == filters['seller_id'])
        
        if filters.get('featured') is not None:
            query = query.filter(Product.featured == filters['featured'])
    
    # Get total count
    total_count = query.count()
    
    # Apply sorting
    sort_by = filters.get('sort_by', 'created_at') if filters else 'created_at'
    sort_order = filters.get('sort_order', 'desc') if filters else 'desc'
    
    if sort_by == 'price':
        # Sort by sale price if available, otherwise by regular price
        if sort_order == 'asc':
            query = query.order_by(
                func.coalesce(Product.sale_price, Product.price).asc()
            )
        else:
            query = query.order_by(
                func.coalesce(Product.sale_price, Product.price).desc()
            )
    else:
        # Sort by other fields
        sort_column = getattr(Product, sort_by, Product.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())
    
    # Apply pagination
    products = query.limit(limit).offset(offset).all()
    
    return products, total_count

def search_sellers(query_text, limit=20, offset=0):
    """
    Search sellers by name, business name, or description
    
    Args:
        query_text (str): Search query
        limit (int): Number of results to return
        offset (int): Offset for pagination
        
    Returns:
        tuple: (sellers, total_count)
    """
    # Base query - join User, Profile, and SellerProfile
    query = (
        db.session.query(User, Profile, SellerProfile)
        .join(Profile, User.id == Profile.user_id)
        .join(SellerProfile, User.id == SellerProfile.user_id)
        .filter(User.role == 'seller', SellerProfile.is_verified == True)
    )
    
    # Apply search
    if query_text:
        search_term = f"%{query_text}%"
        query = query.filter(
            or_(
                Profile.name.ilike(search_term),
                SellerProfile.business_name.ilike(search_term),
                SellerProfile.business_description.ilike(search_term)
            )
        )
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination
    results = query.order_by(SellerProfile.created_at.desc()).limit(limit).offset(offset).all()
    
    # Format results
    sellers = []
    for user, profile, seller_profile in results:
        seller_data = user.to_dict()
        seller_data['profile'] = profile.to_dict()
        seller_data['sellerProfile'] = seller_profile.to_dict()
        sellers.append(seller_data)
    
    return sellers, total_count
