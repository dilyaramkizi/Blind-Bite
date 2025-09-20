import os
import uuid
import json
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from sqlalchemy.orm import joinedload

from models.menu import Menu
from models.allergy import Allergy
from file_upload.upload import allowed_file

from extensions import db

menu_bp = Blueprint('menu', __name__)

# GET all menu items
@menu_bp.route('/menu', methods=['GET'])
def get_menu():
    try:
        menu_items = Menu.query.options(joinedload(Menu.allergies)).all()
        dishes = [{
            'id': str(item.id),
            'name': item.name,
            'description': item.description,
            'cuisine': item.cuisine,
            'spice_level': item.spice_level,
            'calories': item.calories,
            'price': item.price,
            'vegetarian': item.vegetarian,
            'gluten_free': item.gluten_free,
            'ingredients': item.ingredients,
            'allergies': [a.name for a in item.allergies],
            'image_path': f"/static/{item.image_path}" if item.image_path else None,
        } for item in menu_items]
        return jsonify(dishes), 200
    except Exception as e:
        return jsonify({"message": "Failed to fetch menu", "error": str(e)}), 500

# POST new dish
@menu_bp.route('/menu', methods=['POST'])
def add_menu_item():
    try:
        image_file = request.files.get('image')
        data = json.loads(request.form.get('data'))
        filename = None

        if image_file and allowed_file(image_file.filename):
            unique_name = f"{uuid.uuid4()}_{secure_filename(image_file.filename)}"
            image_path = os.path.join(current_app.config['DISH_IMAGE_FOLDER'], unique_name)
            image_file.save(image_path)
            filename = unique_name

        new_dish = Menu(
            name=data['name'],
            description=data['description'],
            cuisine=data.get('cuisine', ''),
            spice_level=data.get('spice_level', 'mild'),
            calories=data.get('calories', 0),
            price=data.get('price', 0.0),
            vegetarian=data.get('vegetarian', False),
            gluten_free=data.get('gluten_free', False),
            ingredients=data.get('ingredients', []),
            image_path=filename
        )

        if 'allergy_ids' in data:
            allergies = Allergy.query.filter(Allergy.id.in_(data['allergy_ids'])).all()
            new_dish.allergies = allergies

        db.session.add(new_dish)
        db.session.commit()

        return jsonify({
            'id': str(new_dish.id),
            **{col.name: getattr(new_dish, col.name) for col in new_dish.__table__.columns},
            'allergies': [{'name': a.name} for a in new_dish.allergies]
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to add dish", "error": str(e)}), 500

# PATCH / DELETE a dish
@menu_bp.route('/menu/<uuid:id>', methods=['PATCH', 'DELETE'])
def menu_item(id):
    dish = Menu.query.get_or_404(id)

    if request.method == 'PATCH':
        try:
            data = json.loads(request.form.get('data'))
            image_file = request.files.get('image')

            if image_file and allowed_file(image_file.filename):
                # Remove old image
                if dish.image_path:
                    old_path = os.path.join(current_app.config['DISH_IMAGE_FOLDER'], dish.image_path)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                # Save new one
                filename = f"{uuid.uuid4()}_{secure_filename(image_file.filename)}"
                image_file.save(os.path.join(current_app.config['DISH_IMAGE_FOLDER'], filename))
                dish.image_path = filename

            for field in ['name', 'description', 'cuisine', 'spice_level', 'calories',
                          'price', 'vegetarian', 'gluten_free', 'ingredients']:
                if field in data:
                    setattr(dish, field, data[field])

            if 'allergy_ids' in data:
                allergies = Allergy.query.filter(Allergy.id.in_(data['allergy_ids'])).all()
                dish.allergies = allergies

            db.session.commit()
            return jsonify({
                'id': str(dish.id),
                **{col.name: getattr(dish, col.name) for col in dish.__table__.columns},
                'allergies': [{'name': a.name} for a in dish.allergies]
            }), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to update dish", "error": str(e)}), 500

    elif request.method == 'DELETE':
        try:
            if dish.image_path:
                file_path = os.path.join(current_app.config['DISH_IMAGE_FOLDER'], dish.image_path)
                if os.path.exists(file_path):
                    os.remove(file_path)

            db.session.delete(dish)
            db.session.commit()
            return jsonify({"message": "Dish deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to delete dish", "error": str(e)}), 500
