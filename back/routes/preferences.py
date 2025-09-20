import uuid
from flask import Blueprint, jsonify, request
from models.preference import Preference
from models.allergy import Allergy
from models.user import User

from extensions import db

preferences_bp = Blueprint('preferences', __name__, url_prefix='/preferences')

# Get and update user preferences
@preferences_bp.route('/<uuid:user_id>', methods=['GET', 'PATCH'])
def user_preferences(user_id):
    if request.method == 'GET':
        preference = Preference.query.filter_by(user_id=user_id).first()
        if not preference:
            return jsonify({"message": "Preferences not found"}), 404
            
        return jsonify({
            "spice_level": preference.spice_level,
            "calories": preference.calories,
            "price": preference.price,
            "gluten_free": preference.gluten_free,
            "vegetarian": preference.vegetarian,
            "allergies": [str(a.id) for a in preference.allergies]
        }), 200

    elif request.method == 'PATCH':
        data = request.get_json()
        preference = Preference.query.filter_by(user_id=user_id).first()
        
        if not preference:
            return jsonify({"message": "Preferences not found"}), 404

        try:
            # Update scalar fields
            if 'spice_level' in data:
                preference.spice_level = data['spice_level']
            if 'calories' in data:
                preference.calories = data['calories']
            if 'price' in data:
                preference.price = data['price']
            if 'gluten_free' in data:
                preference.gluten_free = data['gluten_free']
            if 'vegetarian' in data:
                preference.vegetarian = data['vegetarian']

            # Update allergies
            if 'allergies' in data:
                allergy_uuids = [uuid.UUID(aid) for aid in data['allergies']]
                allergies = Allergy.query.filter(Allergy.id.in_(allergy_uuids)).all()
                preference.allergies = allergies

            db.session.commit()
            return jsonify({"message": "Preferences updated successfully"}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to update preferences", "error": str(e)}), 500


# Create user preferences
@preferences_bp.route('', methods=['POST'])
def create_preferences():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400

    try:
        with db.session.begin_nested():
            # Delete existing preferences and associations
            existing = Preference.query.filter_by(user_id=user_id).first()
            if existing:
                db.session.delete(existing)
                db.session.flush()  # Ensure deletion completes before creating new

            # Create new preference
            preference = Preference(
                user_id=user_id,
                spice_level=data.get('spice_level', 'mild'),
                calories=data.get('calories', 0),
                price=data.get('price', 0),
                gluten_free=data.get('gluten_free', False),
                vegetarian=data.get('vegetarian', False)
            )

            # Handle allergies with UUID validation
            if 'allergies' in data:
                try:
                    allergy_uuids = [uuid.UUID(aid) for aid in data['allergies']]
                except ValueError as e:
                    return jsonify({"message": f"Invalid UUID format: {str(e)}"}), 400

                allergies = Allergy.query.filter(Allergy.id.in_(allergy_uuids)).all()
                preference.allergies = allergies

            db.session.add(preference)
        
        db.session.commit()
        return jsonify({"message": "Preferences created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"message": "Failed to create preferences", "error": str(e)}), 500


# Create or update user preferences
@preferences_bp.route('', methods=['POST', 'PATCH'])
def handle_preferences():
    data = request.get_json()
    try:
        user_id = uuid.UUID(data['user_id'])
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Create or update preferences
        if user.preference:
            preference = user.preference
            action = 'updated'
        else:
            preference = Preference(user_id=user_id)
            action = 'created'

        # Update scalar fields
        preference.spice_level = data.get('spice_level', preference.spice_level)
        preference.calories = data.get('calories', preference.calories)
        preference.price = data.get('price', preference.price)
        preference.gluten_free = data.get('gluten_free', preference.gluten_free)
        preference.vegetarian = data.get('vegetarian', preference.vegetarian)

        # Update allergies
        if 'allergies' in data:
            allergy_uuids = [uuid.UUID(aid) for aid in data['allergies']]
            preference.allergies = Allergy.query.filter(Allergy.id.in_(allergy_uuids)).all()

        db.session.add(preference)
        db.session.commit()

        return jsonify({
            "message": f"Preferences {action} successfully",
            "preference_id": str(preference.id),
            "allergies": [str(a.id) for a in preference.allergies]
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
