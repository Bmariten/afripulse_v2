from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

# Initialize SQLAlchemy
db = SQLAlchemy()

# Import models after db initialization to avoid circular imports
from .user import User
from .profile import Profile
from .seller_profile import SellerProfile
from .affiliate_profile import AffiliateProfile
from .product import Product
from .product_image import ProductImage
from .cart import Cart
from .cart_item import CartItem
from .order import Order
from .order_item import OrderItem
from .affiliate_link import AffiliateLink
from .affiliate_click import AffiliateClick
from .flagged_activity import FlaggedActivity
from .category import Category
from .token_blocklist import TokenBlocklist
