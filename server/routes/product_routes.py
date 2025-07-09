from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
import os
from werkzeug.utils import secure_filename
from slugify import slugify

from models import db, Product, ProductImage, SellerProfile, User, Profile, Category
import os
from utils.auth_helpers import seller_required, admin_required

product_bp = Blueprint('product', __name__)

@product_bp.route('/for-affiliates', methods=['GET'])
@jwt_required()
def get_products_for_affiliates():
    """
    Get all active products and include the seller's default commission rate.
    This is for affiliates to browse products they can promote.
    """
    try:
        products_with_commission = db.session.query(
            Product,
            SellerProfile.default_commission_rate
        ).join(
            SellerProfile, Product.seller_id == SellerProfile.id
        ).filter(
            Product.status == 'active',
            Product.is_approved == 1
        ).order_by(Product.created_at.desc()).all()

        results = []
        for product, commission_rate in products_with_commission:
            product_dict = product.to_dict()
            product_dict['default_commission_rate'] = float(commission_rate) if commission_rate is not None else None
            results.append(product_dict)

        return jsonify(results), 200
    except Exception as e:
        # In a real app, you'd log this error
        # from app import logger; logger.error(f"Error fetching products for affiliates: {e}")
        return jsonify({'message': 'An internal error occurred'}), 500

product_bp = Blueprint('product', __name__)

# Helper function to check if file extension is allowed
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@product_bp.route('/', methods=['GET'])
def get_all_products():
    """Get all active products"""
    try:
        # Get query parameters
        category = request.args.get('category')
        seller_id = request.args.get('seller_id')
        search = request.args.get('search')
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Base query - join Product with SellerProfile to access commission rate
        query = db.session.query(Product, SellerProfile.default_commission_rate).join(SellerProfile, Product.seller_id == SellerProfile.id).filter(Product.status == 'active')
        
        # Apply filters
        if category:
            query = query.filter(Product.category_id == category)
        
        if seller_id:
            # The frontend sends the seller_profile_id, which is what the Product.seller_id links to.
            # We already joined SellerProfile above, so we don't need to join again
            query = query.filter(SellerProfile.id == seller_id)
        
        if search:
            query = query.filter(Product.name.ilike(f'%{search}%') | 
                                Product.description.ilike(f'%{search}%'))
        
        # Get total count before pagination
        total = query.count()
        
        # Apply pagination
        results = query.order_by(Product.created_at.desc()).offset(offset).limit(limit).all()

        # Format products to include commission rate
        products_list = []
        for product, commission_rate in results:
            product_dict = product.to_dict()
            product_dict['commission_rate'] = float(commission_rate) if commission_rate is not None else 0
            products_list.append(product_dict)
        
        return jsonify({
            'products': products_list,
            'total': total,
            'limit': limit,
            'offset': offset
        }), 200
        
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"\n\nERROR in get_all_products: {e}\n{error_traceback}\n\n")
        return jsonify({'message': f'Error fetching products: {str(e)}'}), 500

@product_bp.route('/<slug>', methods=['GET'])
def get_product(slug):
    """Get a product by slug"""
    try:
        product = Product.query.filter_by(slug=slug).first()
        
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        return jsonify(product.to_dict()), 200
        
    except Exception as e:
        return jsonify({'message': f'Error fetching product: {str(e)}'}), 500


@product_bp.route('/admin/pending-products', methods=['GET'])
@jwt_required()
@admin_required
def get_pending_products():
    """Get all products pending approval (admin only)"""
    try:
        # is_approved is a SmallInteger, 0 for pending, 1 for approved
        # Join with SellerProfile to get seller information
        products_with_seller = db.session.query(
            Product, 
            SellerProfile.business_name.label('sellerBusinessName'),
            User.id.label('seller_user_id')
        ).join(
            SellerProfile, Product.seller_id == SellerProfile.id
        ).join(
            User, SellerProfile.user_id == User.id
        ).filter(
            Product.is_approved == 0
        ).order_by(Product.created_at.asc()).all()
        
        # Format the response
        result = []
        for product, seller_name, seller_user_id in products_with_seller:
            product_dict = product.to_dict()
            product_dict['sellerBusinessName'] = seller_name
            product_dict['seller_user_id'] = seller_user_id
            result.append(product_dict)
        
        # Return real data only, no mock data
        # This ensures the admin sees the actual state of the database
        return jsonify(result), 200
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'message': f'Error fetching pending products: {str(e)}'}), 500

@product_bp.route('/admin/all-products', methods=['GET'])
@jwt_required()
@admin_required
def get_all_products_admin():
    try:
        # Get all products with seller information
        products_with_seller = db.session.query(
            Product,
            Profile.name.label('seller_name'),
            User.id.label('seller_user_id'),
            Category.name.label('category_name')
        ).join(
            SellerProfile, Product.seller_id == SellerProfile.id
        ).join(
            User, SellerProfile.user_id == User.id
        ).join(
            Profile, User.id == Profile.user_id
        ).outerjoin(
            Category, Product.category_id == Category.id
        ).order_by(Product.created_at.desc()).all()
        
        # Format the response
        result = []
        for product, seller_name, seller_user_id, category_name in products_with_seller:
            product_dict = product.to_dict()
            product_dict['seller_name'] = seller_name
            product_dict['seller_user_id'] = seller_user_id
            product_dict['category'] = category_name or 'Uncategorized'
            result.append(product_dict)
        
        return jsonify(result), 200
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'message': f'Error fetching all products: {str(e)}'}), 500


# Removed duplicate endpoint - using the more detailed one above


@product_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    """Create a new product (seller or admin only)"""
    try:
        user_id = get_jwt_identity()
        # Ensure we are querying the SellerProfile model, not Profile
        seller_profile = SellerProfile.query.filter_by(user_id=user_id).first()

        if not seller_profile:
            return jsonify({'message': 'Seller profile not found for the authenticated user.'}), 404

        data = request.form
        required_fields = ['name', 'price', 'description', 'category', 'inventory_count']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Missing required field: {field}'}), 400

        # --- Category Validation ---
        category_slug = data.get('category')
        category = Category.query.filter_by(slug=category_slug).first()
        if not category:
            return jsonify({'message': f'Category with slug "{category_slug}" not found'}), 400

        # --- Slug Generation ---
        base_slug = slugify(data.get('name'))
        slug = base_slug
        counter = 1
        while Product.query.filter_by(slug=slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1

        # --- Product Creation ---
        new_product = Product(
            name=data.get('name'),
            slug=slug,
            description=data.get('description'),
            long_description=data.get('long_description'),
            price=data.get('price'),
            discount_price=data.get('discount_price'),
            inventory_count=data.get('inventory_count'),
            category_id=category.id,
            seller_id=seller_profile.id, # This now correctly references the SellerProfile's ID
            status='pending',
            is_approved=0
        )
        db.session.add(new_product)
        db.session.flush()  # Flush to get the new_product.id

        # --- Image Upload Handling ---
        files = request.files.getlist('images')
        if not files or files[0].filename == '':
            db.session.rollback()
            return jsonify({'message': 'At least one image is required'}), 400

        image_urls = []
        # Correctly navigate up one level from 'server' to the project root, then to 'public'
        upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'uploads', 'products'))
        os.makedirs(upload_folder, exist_ok=True)

        for file in files:
            if file and allowed_file(file.filename):
                # Create a unique filename to prevent overwrites
                filename = secure_filename(f"{new_product.id}_{file.filename}")
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                image_url = f'/uploads/products/{filename}'
                image_urls.append(image_url)

                new_image = ProductImage(
                    product_id=new_product.id,
                    image_url=image_url
                )
                db.session.add(new_image)
            else:
                db.session.rollback()
                return jsonify({'message': f'Invalid file type or empty file submitted: {file.filename}'}), 400

        if not image_urls:
            db.session.rollback()
            return jsonify({'message': 'No valid images were uploaded.'}), 400

        db.session.commit()
        return jsonify({
            'message': 'Product created successfully and is pending review.',
            'product': new_product.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error creating product: {e}")
        print(error_trace)
        return jsonify({'message': f'An internal error occurred: {str(e)}', 'trace': error_trace}), 500


@product_bp.route('/<string:product_id>', methods=['PUT'])
@jwt_required()
@seller_required
def update_product(product_id):
    """Update an existing product (owner only)"""
    try:
        user_id = get_jwt_identity()
        seller_profile = SellerProfile.query.filter_by(user_id=user_id).first()
        if not seller_profile:
            return jsonify({'message': 'Seller profile not found'}), 404

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        # Authorization check: ensure the seller owns this product
        if product.seller_id != seller_profile.id:
            return jsonify({'message': 'Unauthorized to edit this product'}), 403

        data = request.form

        # Update fields if they are provided in the request
        if 'name' in data:
            product.name = data['name']
            # Regenerate slug if name changes
            base_slug = slugify(data['name'])
            slug = base_slug
            counter = 1
            while Product.query.filter(Product.slug == slug, Product.id != product.id).first():
                slug = f"{base_slug}-{counter}"
                counter += 1
            product.slug = slug
        
        if 'description' in data:
            product.description = data['description']
        if 'long_description' in data:
            product.long_description = data['long_description']
        if 'price' in data:
            product.price = data['price']
        if 'discount_price' in data:
            product.discount_price = data.get('discount_price')
        if 'inventory_count' in data:
            product.inventory_count = data['inventory_count']
        
        if 'category' in data:
            category = Category.query.filter_by(slug=data['category']).first()
            if not category:
                return jsonify({'message': f'Category {data["category"]} not found'}), 400
            product.category_id = category.id

        # After any significant update, send for re-approval
        product.status = 'pending'
        product.is_approved = 0

        # Note: Image updates are not handled in this request.

        db.session.commit()
        return jsonify({
            'message': 'Product updated successfully and is pending re-approval.',
            'product': product.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error updating product: {e}\n{error_trace}")
        return jsonify({'message': 'An internal error occurred', 'trace': error_trace}), 500


@product_bp.route('/<string:product_id>', methods=['DELETE'])
@jwt_required()
@seller_required
def delete_product(product_id):
    """Delete a product (owner only)"""
    try:
        user_id = get_jwt_identity()
        seller_profile = SellerProfile.query.filter_by(user_id=user_id).first()
        if not seller_profile:
            return jsonify({'message': 'Seller profile not found'}), 404

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        # Authorization check
        if product.seller_id != seller_profile.id:
            return jsonify({'message': 'Unauthorized to delete this product'}), 403

        # Delete associated images from the filesystem first
        upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'public'))
        for image in product.images:
            try:
                file_path = os.path.join(upload_folder, image.image_url.lstrip('/'))
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as img_e:
                print(f"Error deleting image file {image.image_url}: {img_e}")

        db.session.delete(product)
        db.session.commit()

        return jsonify({'message': 'Product deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error deleting product: {e}\n{error_trace}")
        return jsonify({'message': 'An internal error occurred', 'trace': error_trace}), 500




@product_bp.route('/<product_id>/images', methods=['POST'])
@jwt_required()
def upload_product_images(product_id):
    """Upload images for a product"""
    user_id = get_jwt_identity()
    
    if 'images' not in request.files:
        return jsonify({'message': 'No images provided'}), 400
    
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'message': 'Product not found'}), 404
        
        # Check if user is the seller or an admin
        user = User.query.get(user_id)
        if product.seller_id != user_id and user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403
        
        uploaded_images = []
        files = request.files.getlist('images')
        
        for i, file in enumerate(files):
            if file and allowed_file(file.filename):
                # Create unique filename
                filename = secure_filename(file.filename)
                ext = filename.rsplit('.', 1)[1].lower()
                new_filename = f"{product.slug}-{str(uuid.uuid4())[:8]}.{ext}"
                
                # Create directory if it doesn't exist
                upload_dir = os.path.join('public', 'uploads', 'products')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Save file
                file_path = os.path.join(upload_dir, new_filename)
                file.save(file_path)
                
                # Create image record
                image = ProductImage(
                    id=str(uuid.uuid4()),
                    product_id=product_id,
                    url=f"/uploads/products/{new_filename}",
                    alt_text=request.form.get(f'alt_text_{i}', product.name),
                    is_primary=i == 0 and not ProductImage.query.filter_by(product_id=product_id, is_primary=True).first(),
                    display_order=i
                )
                
                db.session.add(image)
                uploaded_images.append(image)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Images uploaded successfully',
            'images': [image.to_dict() for image in uploaded_images]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error uploading images: {str(e)}'}), 500

@product_bp.route('/<product_id>/approve', methods=['POST'])
@jwt_required()
@admin_required
def approve_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        product.status = 'active'
        product.is_approved = 1
        db.session.commit()
        return jsonify({'message': 'Product approved successfully', 'product': product.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

@product_bp.route('/<product_id>/reject', methods=['POST'])
@jwt_required()
@admin_required
def reject_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        product.status = 'rejected'
        product.is_approved = 2 # Using 2 for rejected
        db.session.commit()
        return jsonify({'message': 'Product rejected successfully', 'product': product.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500
