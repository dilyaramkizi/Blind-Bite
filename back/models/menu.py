import uuid
from sqlalchemy.dialects.postgresql import UUID
from extensions import db

menu_allergy = db.Table(
    'menu_allergy',
    db.Column('menu_id', UUID(as_uuid=True), db.ForeignKey('menu.id'), primary_key=True),
    db.Column('allergy_id', UUID(as_uuid=True), db.ForeignKey('allergies.id'), primary_key=True),
    db.Column('has_allergy', db.Boolean, default=False)
)

# Menu model
class Menu(db.Model):
    __tablename__ = 'menu'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    cuisine = db.Column(db.String(50))
    spice_level = db.Column(db.String(20))
    calories = db.Column(db.Integer)
    price = db.Column(db.Float)
    vegetarian = db.Column(db.Boolean)
    gluten_free = db.Column(db.Boolean)
    ingredients = db.Column(db.ARRAY(db.String))
    image_path = db.Column(db.String(200))

    # Relationship to Allergy model
    allergies = db.relationship('Allergy', secondary=menu_allergy, back_populates='menus', lazy='joined')
