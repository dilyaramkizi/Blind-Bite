import uuid
from sqlalchemy.dialects.postgresql import UUID

from extensions import db

preference_allergy = db.Table(
    'preference_allergy',
    db.Column('preference_id', 
              UUID(as_uuid=True), 
              db.ForeignKey('preferences.id', ondelete='CASCADE'),
              primary_key=True),  # Add primary_key here
    db.Column('allergy_id', 
              UUID(as_uuid=True), 
              db.ForeignKey('allergies.id', ondelete='RESTRICT'),
              primary_key=True)   # And here
)

class Preference(db.Model):
    __tablename__ = 'preferences'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    spice_level = db.Column(db.String(20))
    calories = db.Column(db.Integer)
    price = db.Column(db.Float)
    gluten_free = db.Column(db.Boolean)
    vegetarian = db.Column(db.Boolean)

    user = db.relationship('User', back_populates='preference', uselist=False)
    allergies = db.relationship(
        'Allergy', 
        secondary=preference_allergy,
        backref='preferences',
        cascade='save-update, merge',  # Only manage associations
        passive_deletes=True
    )