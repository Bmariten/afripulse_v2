import uuid
from . import db
from sqlalchemy.sql import func

class TokenBlocklist(db.Model):
    """
    Model for storing revoked JWT tokens.
    """
    __tablename__ = 'token_blocklist'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f'<TokenBlocklist jti={self.jti}>'
