import os
from dotenv import load_dotenv
import sys
from flask import Flask, jsonify, request, send_from_directory, redirect, make_response

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_migrate import Migrate
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix
import bcrypt
import uuid
from datetime import datetime, timedelta

# Import database and models
from models import db, User, Profile, TokenBlocklist, AffiliateLink, Product

# Import routes
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.product_routes import product_bp
from routes.seller_routes import seller_bp
from routes.cart_routes import cart_bp
from routes.category_routes import category_bp
from routes.profile_routes import profile_bp
from routes.admin_routes import admin_bp
from routes.affiliate_routes import affiliate_bp

# Import utilities
from utils.logger import setup_logger

# Load environment variables from .env file
load_dotenv()

# Create Flask app
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)

# Load configuration
env = os.environ.get('FLASK_ENV', 'development')
if env == 'production':
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')

# Disable strict slashes to prevent redirects on API calls
app.url_map.strict_slashes = False

# Setup logging
logger = setup_logger()

# Log the database URI to verify it's correct
logger.info(f"Connecting to database: {app.config.get('SQLALCHEMY_DATABASE_URI')}")

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate
jwt = JWTManager(app)

# Callback function to check if a JWT exists in the database blocklist
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

# Database migrations are now handled by Flask-Migrate.
# The `db.create_all()` call has been removed to avoid conflicts.
# Use `flask db upgrade` to apply migrations.

# Setup CORS - Allow all origins in development mode
if env == 'development':
    CORS(app, 
         resources={r"/*": {"origins": "*"}}, 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         max_age=3600)
else:
    # In production, restrict to specific origins
    CORS(app, 
         resources={r"/api/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5000", "http://127.0.0.1:5000"], 
                              "supports_credentials": True,
                              "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
                              "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                              "max_age": 3600}})

# Create a decorator to exempt OPTIONS requests from rate limiting
@app.before_request
def handle_options_request():
    if request.method == 'OPTIONS':
        # Explicitly set the response headers for OPTIONS requests
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Max-Age', '3600')
        return response

# Setup rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
    strategy="fixed-window" # Use fixed window strategy for more predictable rate limiting
)

# Exempt OPTIONS requests from rate limiting
@limiter.request_filter
def limiter_filter():
    return request.method == 'OPTIONS'

# Apply rate limiting to specific routes
if env == 'production':
    auth_limiter = limiter.shared_limit("5 per minute", scope="auth")
    api_limiter = limiter.shared_limit("60 per minute", scope="api")
else:
    logger.info('Rate limiting disabled for development environment')
    auth_limiter = lambda: None
    api_limiter = lambda: None

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(product_bp, url_prefix='/api/products')
app.register_blueprint(seller_bp, url_prefix='/api/sellers')
app.register_blueprint(cart_bp, url_prefix='/api/cart')
app.register_blueprint(category_bp, url_prefix='/api/categories')
app.register_blueprint(profile_bp, url_prefix='/api/profile')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(affiliate_bp, url_prefix='/api/affiliate')

# Add comprehensive request and response logging
@app.before_request
def log_request_info():
    """Log incoming request details for debugging."""
    # Exclude health check from verbose logging
    if request.path == '/health':
        return
    logger.info('='*50)
    logger.info(f'Request: {request.method} {request.url}')
    logger.info(f'Remote Address: {request.remote_addr}')
    
    # Log headers safely, excluding sensitive ones
    headers = {k: v for k, v in request.headers.items() if k.lower() not in ['authorization', 'cookie']}
    logger.info(f'Headers: {headers}')
    
    # Avoid logging request body for multipart/form-data to prevent errors with binary files
    if request.mimetype == 'multipart/form-data':
        logger.info('Body: [multipart/form-data] - not logged to avoid binary data issues.')
    elif request.get_data():
        try:
            # Try to log body, truncate if too long
            body_data = request.get_data(as_text=True)
            if len(body_data) > 1000:
                logger.info(f'Body (truncated): {body_data[:1000]}...')
            else:
                logger.info(f'Body: {body_data}')
        except Exception as e:
            logger.warning(f'Could not parse request body: {e}')
    logger.info('-'*50)


@app.after_request
def log_response_info(response):
    """Log outgoing response details for debugging."""
    # Exclude health check from verbose logging
    if request.path == '/health':
        return response
        
    logger.info('-'*50)
    logger.info(f'Response Status: {response.status}')
    
    # Avoid logging large file downloads or binary content
    if response.content_length and response.content_length < 5000 and response.is_json:
        try:
            logger.info(f'Response Body: {response.get_json()}')
        except Exception as e:
            logger.warning(f'Could not parse response JSON: {e}')
    
    logger.info('='*50)
    return response

# Serve static files
@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(os.path.join(app.root_path, 'public', 'uploads'), filename)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()}), 200

# Public tracking endpoint for affiliate links
@app.route('/track/<code>', methods=['GET'])
def track_affiliate_link(code):
    # Already imported at the top
    link = AffiliateLink.query.filter_by(code=code).first()
    if not link:
        return jsonify({'error': 'Not found'}), 404

    link.clicks += 1
    db.session.commit()

    product = Product.query.get(link.product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    # Redirect to the frontend product page
    # The frontend URL should ideally come from a config
    frontend_url = f'http://localhost:8080/products/{product.slug}'
    return redirect(frontend_url)

# Comment out the trailing slash handler to prevent redirect loops
# @app.before_request
# def remove_trailing_slash():
#     if request.path != '/' and request.path.endswith('/'):
#         return redirect(request.path[:-1])

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def server_error(error):
    import traceback
    error_traceback = traceback.format_exc()
    logger.error(f"Server error: {error}")
    logger.error(error_traceback)
    print(f"\n\nDETAILED ERROR: {error}\n{error_traceback}\n\n")
    return jsonify({"error": "Internal server error", "details": str(error)}), 500

# Create admin user function
def create_admin_user():
    try:
        # Admin user details - use environment variables with fallbacks
        admin_email = os.environ.get('ADMIN_EMAIL', 'bmariten@gmail.com')
        # Use a default password that's easy to remember but secure enough
        default_password = 'Admin@123'
        admin_password = os.environ.get('ADMIN_PASSWORD', default_password)
        admin_name = os.environ.get('ADMIN_NAME', 'Bernard Mariten')
        
        # Check if admin already exists
        existing_admin = User.query.filter_by(email=admin_email).first()
        
        if existing_admin:
            logger.info(f'Admin user already exists with email: {admin_email}')
            return
        
        # Hash the password
        hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create the admin user
        admin_user = User(
            id=str(uuid.uuid4()),
            email=admin_email,
            password=hashed_password,
            role='admin',
            is_email_verified=True  # Auto-verify admin email
        )
        
        db.session.add(admin_user)
        db.session.commit()
        
        # Log the actual password used for initial setup
        logger.info(f'Created admin user with password: {admin_password}')
        
        # Create a basic profile for the admin
        admin_profile = Profile(
            id=str(uuid.uuid4()),
            user_id=admin_user.id,
            name=admin_name
        )
        
        db.session.add(admin_profile)
        db.session.commit()
        
        logger.info('----------------------------------------')
        logger.info('Admin user created successfully!')
        logger.info(f'Name: {admin_name}')
        logger.info(f'Email: {admin_email}')
        logger.info(f'Password: {admin_password}')
        logger.info('----------------------------------------')
    except Exception as error:
        logger.error(f'Failed to create admin user: {error}')

# Main entry point
if __name__ == '__main__':
    with app.app_context():
        # The `db.create_all()` call is removed. Migrations handle the schema.
        # Create admin user
        create_admin_user()
    
    # Start the server
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=env != 'production')
