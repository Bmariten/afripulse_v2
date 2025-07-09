import uuid
from sqlalchemy.sql import func
from sqlalchemy import Numeric, Text, Integer, SmallInteger, String, DateTime, ForeignKey
from . import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(String(255), nullable=False)
    slug = db.Column(String(255), nullable=False, unique=True)
    description = db.Column(Text, nullable=True)
    long_description = db.Column(Text, nullable=True)
    price = db.Column(Numeric(10, 2), nullable=False)
    discount_price = db.Column(Numeric(10, 2), nullable=True)
    inventory_count = db.Column(Integer, nullable=True, default=0)
    category_id = db.Column(String(36), ForeignKey('categories.id'), nullable=False)
    seller_id = db.Column(String(36), ForeignKey('seller_profiles.id', ondelete='CASCADE'), nullable=False)
    featured = db.Column(SmallInteger, nullable=True, default=0)  # TINYINT
    status = db.Column(String(255), nullable=True, default='pending')
    is_approved = db.Column(SmallInteger, nullable=True, default=0)  # TINYINT
    created_at = db.Column(DateTime, nullable=True, default=func.now())
    updated_at = db.Column(DateTime, nullable=True, default=func.now(), onupdate=func.now())
    
    # Relationships
    images = db.relationship('ProductImage', back_populates='product', lazy='dynamic', cascade='all, delete-orphan')
    cart_items = db.relationship('CartItem', back_populates='product', lazy='dynamic')
    order_items = db.relationship('OrderItem', back_populates='product', lazy='dynamic')
    category = db.relationship('Category', back_populates='products')
    seller = db.relationship('SellerProfile', back_populates='products')
    
    def to_dict(self):
        """Convert product object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'long_description': self.long_description,
            'price': float(self.price) if self.price is not None else None,
            'discount_price': float(self.discount_price) if self.discount_price is not None else None,
            'category': self.category.to_dict() if self.category else None,
            'inventory_count': self.inventory_count,
            'seller_id': self.seller_id,
            'sellerBusinessName': self.seller.business_name if self.seller else None,
            'featured': self.featured,
            'status': self.status,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'images': [image.to_dict() for image in self.images]
        }
