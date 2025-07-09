import uuid
from sqlalchemy.sql import func
from . import db

class AffiliateProfile(db.Model):
    __tablename__ = 'affiliate_profiles'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    website = db.Column(db.String(255), nullable=True)
    social_media = db.Column(db.String(255), nullable=True)
    niche = db.Column(db.String(255), nullable=True)
    paypal_email = db.Column(db.String(255), nullable=True)
    bank_account = db.Column(db.String(255), nullable=True)
    commission_rate = db.Column(db.Numeric(5, 2), default=10.00, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    affiliate_links = db.relationship('AffiliateLink', backref='affiliate', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert affiliate profile object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'website': self.website,
            'social_media': self.social_media,
            'niche': self.niche,
            'paypal_email': self.paypal_email,
            'bank_account': self.bank_account,
            'commission_rate': float(self.commission_rate) if self.commission_rate is not None else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
