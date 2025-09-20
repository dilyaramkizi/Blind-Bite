import uuid
from extensions import db
from sqlalchemy.dialects.postgresql import UUID
from models.menu import menu_allergy

class Allergy(db.Model):
    __tablename__ = 'allergies'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), unique=True, nullable=False)

    menus = db.relationship('Menu', secondary=menu_allergy, back_populates='allergies')
