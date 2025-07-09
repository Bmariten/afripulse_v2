import uuid
from sqlalchemy.sql import func
from sqlalchemy import SmallInteger
from . import db

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    is_primary = db.Column(SmallInteger, default=0) # TINYINT
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=True)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=True)

    # Relationships
    product = db.relationship('Product', back_populates='images')
    
    def to_dict(self):
        """Convert product image object to dictionary"""
        return {
            'id': self.id,
            'product_id': self.product_id,
            'image_url': self.image_url,
            'is_primary': self.is_primary,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
