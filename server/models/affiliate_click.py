import uuid
from sqlalchemy.sql import func
from . import db

class AffiliateClick(db.Model):
    __tablename__ = 'affiliate_clicks'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    link_id = db.Column(db.String(36), db.ForeignKey('affiliate_links.id', ondelete='CASCADE'), nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    
    # Relationships
    link = db.relationship('AffiliateLink', backref=db.backref('click_events', lazy=True, cascade="all, delete-orphan"))
    
    def to_dict(self):
        """Convert affiliate click object to dictionary"""
        return {
            'id': self.id,
            'link_id': self.link_id,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
