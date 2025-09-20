import uuid
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

from extensions import db

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    order_id = db.Column(UUID(as_uuid=True), db.ForeignKey('orders.id'), primary_key=True)
    menu_id = db.Column(UUID(as_uuid=True), db.ForeignKey('menu.id'), primary_key=True)
    
    quantity = db.Column(db.Integer, default=1)

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    total_price = db.Column(db.Float)
    total_calories = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')
    
    # Relationship to OrderItem
    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "total_price": self.total_price,
            "total_calories": self.total_calories,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }