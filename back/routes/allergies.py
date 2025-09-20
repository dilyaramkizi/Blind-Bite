# routes/allergy.py
from flask import Blueprint, jsonify
from models.allergy import Allergy

allergy_bp = Blueprint('allergy', __name__)

@allergy_bp.route('/allergies', methods=['GET'])
def get_allergies():
    try:
        allergies = Allergy.query.all()
        return jsonify([{
            'id': str(allergy.id),
            'name': allergy.name
        } for allergy in allergies]), 200
    except Exception as e:
        return jsonify({"message": "Failed to fetch allergies", "error": str(e)}), 500
