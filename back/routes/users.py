from flask import Blueprint, request, jsonify
from models.user import User

from extensions import db

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([{
            'id': str(user.id),
            'name': user.name,
            'email': user.email,
            'role': user.role
        } for user in users]), 200
    except Exception as e:
        return jsonify({"message": "Failed to fetch users", "error": str(e)}), 500
    
@user_bp.route('/users/<uuid:id>', methods=['PUT'])
def update_user(id):
    try:
        data = request.get_json()
        user = User.query.get_or_404(id)
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.role = data.get('role', user.role)
        db.session.commit()
        return jsonify({
            'id': str(user.id),
            'name': user.name,
            'email': user.email,
            'role': user.role
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update user", "error": str(e)}), 500
