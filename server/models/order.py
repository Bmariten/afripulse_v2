import uuid
from sqlalchemy.sql import func
from sqlalchemy import Numeric, String, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import LONGTEXT
from . import db

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = db.Column(String(36), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    total_amount = db.Column(Numeric(10, 2), nullable=False)
    status = db.Column(String(255), nullable=True, default='pending')
    shipping_address = db.Column(LONGTEXT, nullable=True)
    billing_address = db.Column(LONGTEXT, nullable=True)
    payment_intent_id = db.Column(String(255), nullable=True)
    created_at = db.Column(DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        """Convert order object to dictionary"""
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'total_amount': float(self.total_amount) if self.total_amount is not None else None,
            'status': self.status,
            'shipping_address': self.shipping_address,
            'billing_address': self.billing_address,
            'payment_intent_id': self.payment_intent_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }
