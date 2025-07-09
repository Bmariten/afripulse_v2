import uuid
from sqlalchemy.sql import func
from . import db

class FlaggedActivity(db.Model):
    __tablename__ = 'flagged_activities'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    activity_type = db.Column(db.Enum('login', 'signup', 'order', 'payment', 'product_creation', 'profile_update', 'other', name='activity_types'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    status = db.Column(db.Enum('pending', 'reviewed', 'resolved', 'dismissed', name='flag_status'), default='pending')
    reviewed_by = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    resolution_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], backref='flagged_activities')
    reviewer = db.relationship('User', foreign_keys=[reviewed_by], backref='reviewed_flags')
    
    def to_dict(self):
        """Convert flagged activity object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'activity_type': self.activity_type,
            'description': self.description,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'status': self.status,
            'reviewed_by': self.reviewed_by,
            'resolution_notes': self.resolution_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
