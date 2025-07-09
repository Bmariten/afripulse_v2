import uuid
from sqlalchemy.sql import func
from . import db

class AffiliateLink(db.Model):
    __tablename__ = 'affiliate_links'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    affiliate_id = db.Column(db.String(36), db.ForeignKey('affiliate_profiles.id', ondelete='CASCADE'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    code = db.Column(db.String(50), nullable=False, unique=True)
    clicks = db.Column(db.Integer, default=0, nullable=True)
    conversions = db.Column(db.Integer, default=0, nullable=True)
    earnings = db.Column(db.Float, default=0.0, nullable=True)  # Total earnings from this link
    commission_rate = db.Column(db.Float, nullable=False)  # Rate at time of link creation
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    product = db.relationship('Product', backref='affiliate_links')
    
    def to_dict(self):
        """Convert affiliate link object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'affiliate_id': self.affiliate_id,
            'product_id': self.product_id,
            'code': self.code,
            'clicks': self.clicks,
            'conversions': self.conversions,
            'earnings': self.earnings,
            'commission_rate': self.commission_rate,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'product': self.product.to_dict() if self.product else None
        }
