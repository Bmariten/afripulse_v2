import os
import sys
import bcrypt
import uuid
from datetime import datetime

# Add parent directory to path to import from models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from models import db, User, Profile, SellerProfile, AffiliateProfile, Product, Category

def create_admin_user():
    """Create admin user if it doesn't exist"""
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@afripulse.com')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    # Check if admin exists
    admin = User.query.filter_by(email=admin_email).first()
    
    if not admin:
        # Hash password
        hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create admin user
        admin = User(
            id=str(uuid.uuid4()),
            email=admin_email,
            password=hashed_password,
            role='admin',
            is_email_verified=True
        )
        
        db.session.add(admin)
        
        # Create admin profile
        profile = Profile(
            id=str(uuid.uuid4()),
            user_id=admin.id,
            name='Admin User',
            phone='+1234567890'
        )
        
        db.session.add(profile)
        db.session.commit()
        
        print(f"Admin user created: {admin_email}")
    else:
        print(f"Admin user already exists: {admin_email}")

def create_demo_categories():
    """Create demo categories if they don't exist"""
    categories = [
        {'name': 'Electronics', 'slug': 'electronics'},
        {'name': 'Fashion', 'slug': 'fashion'},
        {'name': 'Home & Garden', 'slug': 'home-garden'},
        {'name': 'Health & Beauty', 'slug': 'health-beauty'},
        {'name': 'Sports & Outdoors', 'slug': 'sports-outdoors'},
        {'name': 'Books & Media', 'slug': 'books-media'},
        {'name': 'Toys & Games', 'slug': 'toys-games'},
        {'name': 'Automotive', 'slug': 'automotive'},
        {'name': 'Handmade', 'slug': 'handmade'},
        {'name': 'Art & Collectibles', 'slug': 'art-collectibles'}
    ]
    
    for category_data in categories:
        # Check if category exists
        category = Category.query.filter_by(slug=category_data['slug']).first()
        
        if not category:
            # Create category
            category = Category(
                id=str(uuid.uuid4()),
                name=category_data['name'],
                slug=category_data['slug']
            )
            
            db.session.add(category)
    
    db.session.commit()
    print(f"Created {len(categories)} demo categories")

def create_demo_users():
    """Create demo users if they don't exist"""
    demo_users = [
        {
            'email': 'seller@example.com',
            'password': 'password123',
            'role': 'seller',
            'profile': {
                'name': 'Demo Seller',
                'phone': '+1234567890',
                'bio': 'I sell high-quality products at affordable prices.'
            },
            'seller_profile': {
                'business_name': 'Demo Shop',
                'business_description': 'Your one-stop shop for all your needs.',
                'business_address': '123 Main St, City, Country',
                'business_phone': '+1234567890',
                'business_email': 'contact@demoshop.com',
                'is_verified': True
            }
        },
        {
            'email': 'affiliate@example.com',
            'password': 'password123',
            'role': 'affiliate',
            'profile': {
                'name': 'Demo Affiliate',
                'phone': '+0987654321',
                'bio': 'I promote great products and earn commissions.'
            },
            'affiliate_profile': {
                'website': 'https://demo-affiliate.com',
                'social_media': 'https://instagram.com/demo_affiliate',
                'niche': 'Electronics, Fashion',
                'commission_rate': 10.0,
                'payment_details': 'PayPal: affiliate@example.com'
            }
        },
        {
            'email': 'customer@example.com',
            'password': 'password123',
            'role': 'customer',
            'profile': {
                'name': 'Demo Customer',
                'phone': '+1122334455',
                'bio': 'I love shopping for unique products.'
            }
        }
    ]
    
    for user_data in demo_users:
        # Check if user exists
        user = User.query.filter_by(email=user_data['email']).first()
        
        if not user:
            # Hash password
            hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Create user
            user = User(
                id=str(uuid.uuid4()),
                email=user_data['email'],
                password=hashed_password,
                role=user_data['role'],
                is_email_verified=True
            )
            
            db.session.add(user)
            db.session.flush()  # Get the ID without committing
            
            # Create profile
            profile_data = user_data.get('profile', {})
            profile = Profile(
                id=str(uuid.uuid4()),
                user_id=user.id,
                name=profile_data.get('name', ''),
                phone=profile_data.get('phone', ''),
                bio=profile_data.get('bio', '')
            )
            
            db.session.add(profile)
            
            # Create seller profile if applicable
            if user.role == 'seller' and 'seller_profile' in user_data:
                seller_data = user_data['seller_profile']
                seller_profile = SellerProfile(
                    id=str(uuid.uuid4()),
                    user_id=user.id,
                    business_name=seller_data.get('business_name', ''),
                    business_description=seller_data.get('business_description', ''),
                    business_address=seller_data.get('business_address', ''),
                    business_phone=seller_data.get('business_phone', ''),
                    business_email=seller_data.get('business_email', ''),
                    verified=seller_data.get('is_verified', False)
                )
                
                db.session.add(seller_profile)
            
            # Create affiliate profile if applicable
            if user.role == 'affiliate' and 'affiliate_profile' in user_data:
                affiliate_data = user_data['affiliate_profile']
                affiliate_profile = AffiliateProfile(
                    id=str(uuid.uuid4()),
                    user_id=user.id,
                    website=affiliate_data.get('website', ''),
                    social_media=affiliate_data.get('social_media', ''),
                    niche=affiliate_data.get('niche', ''),
                    commission_rate=affiliate_data.get('commission_rate', 5.0),
                    paypal_email=affiliate_data.get('payment_details', '').split(': ')[1] if ': ' in affiliate_data.get('payment_details', '') else '',
                    bank_account=''
                )
                
                db.session.add(affiliate_profile)
    
    db.session.commit()
    print(f"Created {len(demo_users)} demo users")

def create_demo_products():
    """Create demo products if they don't exist"""
    # Get seller
    seller = User.query.filter_by(email='seller@example.com').first()
    
    if not seller:
        print("Seller not found. Please create demo users first.")
        return
    
    # Get categories
    electronics = Category.query.filter_by(slug='electronics').first()
    fashion = Category.query.filter_by(slug='fashion').first()
    home = Category.query.filter_by(slug='home-garden').first()
    
    if not electronics or not fashion or not home:
        print("Categories not found. Please create demo categories first.")
        return
    
    demo_products = [
        {
            'name': 'Wireless Bluetooth Earbuds',
            'description': 'High-quality wireless earbuds with noise cancellation and long battery life.',
            'price': 49.99,
            'discount_price': 39.99,
            'inventory_count': 100,
            'category_id': electronics.id if electronics else None,
            'subcategory': 'Audio',
            'featured': True,
            'status': 'active'
        },
        {
            'name': 'Smart Watch',
            'description': 'Track your fitness, receive notifications, and more with this stylish smart watch.',
            'price': 99.99,
            'discount_price': None,
            'inventory_count': 50,
            'category_id': electronics.id if electronics else None,
            'subcategory': 'Wearables',
            'featured': True,
            'status': 'active'
        },
        {
            'name': 'Men\'s Casual T-Shirt',
            'description': 'Comfortable cotton t-shirt perfect for everyday wear.',
            'price': 19.99,
            'discount_price': 14.99,
            'inventory_count': 200,
            'category_id': fashion.id if fashion else None,
            'subcategory': 'Men\'s Clothing',
            'featured': False,
            'status': 'active'
        },
        {
            'name': 'Women\'s Running Shoes',
            'description': 'Lightweight and comfortable running shoes with excellent support.',
            'price': 79.99,
            'discount_price': None,
            'inventory_count': 75,
            'category_id': fashion.id if fashion else None,
            'subcategory': 'Women\'s Shoes',
            'featured': True,
            'status': 'active'
        },
        {
            'name': 'Scented Candle Set',
            'description': 'Set of 3 scented candles to create a relaxing atmosphere in your home.',
            'price': 24.99,
            'discount_price': 19.99,
            'inventory_count': 150,
            'category_id': home.id if home else None,
            'subcategory': 'Home Decor',
            'featured': False,
            'status': 'active'
        }
    ]
    
    for product_data in demo_products:
        # Check if product exists by name
        product = Product.query.filter_by(name=product_data['name'], seller_id=seller.id).first()
        
        if not product:
            # Generate slug from product name
            slug = product_data['name'].lower().replace("'", '').replace(' ', '-')
            
            # Create product
            product = Product(
                id=str(uuid.uuid4()),
                seller_id=seller.id,
                name=product_data['name'],
                slug=slug,
                description=product_data['description'],
                price=product_data['price'],
                discount_price=product_data['discount_price'],
                inventory_count=product_data['inventory_count'],
                category_id=product_data['category_id'],
                featured=product_data['featured'],
                status=product_data['status']
            )
            
            db.session.add(product)
    
    db.session.commit()
    print(f"Created {len(demo_products)} demo products")

def init_db():
    """Initialize database with demo data"""
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Create admin user
        create_admin_user()
        
        # Create demo data
        create_demo_categories()
        create_demo_users()
        create_demo_products()
        
        print("Database initialization complete")

if __name__ == '__main__':
    init_db()
