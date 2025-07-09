import uuid
from sqlalchemy.sql import func
from sqlalchemy import Numeric, String, Integer, DateTime, ForeignKey
from . import db

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = db.Column(String(36), ForeignKey('orders.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(String(36), ForeignKey('products.id', ondelete='SET NULL'), nullable=True)
    product_name = db.Column(String(255), nullable=False)
    quantity = db.Column(Integer, nullable=False, default=1)
    price_per_unit = db.Column(Numeric(10, 2), nullable=False)
    affiliate_id = db.Column(String(36), ForeignKey('affiliate_profiles.id', ondelete='SET NULL'), nullable=True)
    created_at = db.Column(DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    product = db.relationship('Product', back_populates='order_items')
    
    def to_dict(self):
        """Convert order item object to dictionary"""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'price_per_unit': float(self.price_per_unit) if self.price_per_unit is not None else None,
            'affiliate_id': self.affiliate_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'product': self.product.to_dict() if self.product else None
        }
