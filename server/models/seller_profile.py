import uuid
from sqlalchemy.sql import func
from . import db

class SellerProfile(db.Model):
    __tablename__ = 'seller_profiles'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    business_name = db.Column(db.String(255), nullable=True)
    business_description = db.Column(db.Text, nullable=True)
    business_address = db.Column(db.String(255), nullable=True)
    business_city = db.Column(db.String(100), nullable=True)
    business_state = db.Column(db.String(100), nullable=True)
    business_country = db.Column(db.String(100), nullable=True)
    business_zip_code = db.Column(db.String(20), nullable=True)
    business_phone = db.Column(db.String(20), nullable=True)
    business_email = db.Column(db.String(255), nullable=True)
    paypal_email = db.Column(db.String(255), nullable=True)
    bank_account = db.Column(db.String(255), nullable=True)
    default_commission_rate = db.Column(db.Float, nullable=False, default=10.0)
    verified = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    products = db.relationship('Product', back_populates='seller', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert seller profile object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'business_name': self.business_name,
            'business_description': self.business_description,
            'business_address': self.business_address,
            'business_city': self.business_city,
            'business_state': self.business_state,
            'business_country': self.business_country,
            'business_zip_code': self.business_zip_code,
            'business_phone': self.business_phone,
            'business_email': self.business_email,
            'paypal_email': self.paypal_email,
            'bank_account': self.bank_account,
            'default_commission_rate': self.default_commission_rate,
            'verified': self.verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def is_complete(self):
        """Check if the seller profile has all the required business details."""
        required_fields = [
            self.business_name,
            self.business_address,
            self.business_city,
            self.business_state,
            self.business_country,
            self.business_zip_code,
            self.business_phone,
            self.business_email
        ]
        return all(field is not None and field != '' for field in required_fields)
