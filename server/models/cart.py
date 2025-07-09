import uuid
from sqlalchemy.sql import func
from . import db

class Cart(db.Model):
    __tablename__ = 'carts'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    items = db.relationship('CartItem', backref='cart', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert cart object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }
        
    def to_dict_with_items(self):
        """Convert cart object to dictionary with items"""
        # This is an alias for to_dict() since we already include items there
        return self.to_dict()
