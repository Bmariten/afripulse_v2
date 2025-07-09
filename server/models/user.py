import uuid
import bcrypt
from datetime import datetime
from sqlalchemy.sql import func
from . import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('admin', 'seller', 'affiliate', 'customer', name='user_roles'), nullable=False)
    is_profile_complete = db.Column(db.Boolean, default=False, nullable=False)
    is_email_verified = db.Column(db.Boolean, default=False, nullable=False)
    email_verification_token = db.Column(db.String(255), nullable=True)
    password_reset_expires = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    profile = db.relationship('Profile', backref='user', uselist=False, cascade='all, delete-orphan')
    seller_profile = db.relationship('SellerProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    affiliate_profile = db.relationship('AffiliateProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
    
    def check_password(self, password):
        """Verify the password against the stored hash"""
        if isinstance(password, str):
            password = password.encode('utf-8')
        if isinstance(self.password, str):
            stored_password = self.password.encode('utf-8')
        else:
            stored_password = self.password
        return bcrypt.checkpw(password, stored_password)
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'is_profile_complete': self.is_profile_complete,
            'is_email_verified': self.is_email_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'profile': self.profile.to_dict() if self.profile else None,
            'seller_profile': self.seller_profile.to_dict() if self.seller_profile else None,
            'affiliate_profile': self.affiliate_profile.to_dict() if self.affiliate_profile else None
        }
