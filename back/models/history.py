import uuid
from sqlalchemy.dialects.postgresql import UUID
from extensions import db

class History(db.Model):
    __tablename__ = 'history'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    menu_id = db.Column(UUID(as_uuid=True), db.ForeignKey('menu.id'))
