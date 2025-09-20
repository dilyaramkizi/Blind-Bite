import uuid
from sqlalchemy.dialects.postgresql import UUID

from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    avatar = db.Column(db.String(255))  # NEW: stores path or filename of the uploaded image
    role = db.Column(db.String(20), default='client')  # Default 'client'

    history = db.relationship('History', backref='user')
    orders = db.relationship('Order', backref='user', lazy=True)
    # Correct relationship - one-to-one with Preference
    preference = db.relationship(
        'Preference',
        back_populates='user',
        uselist=False,
        cascade='all, delete-orphan',
        single_parent=True
    )

