from flask import Blueprint, jsonify, request, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os

from models.user import User

from extensions import db

auth_bp = Blueprint('auth', __name__)  # Create a blueprint


@auth_bp.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role', 'client')
    avatar = request.files.get('avatar')

    # Validate required fields
    if not name or not email or not password:
        return jsonify({"message": "Name, email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    avatar_filename = None
    if avatar:
        avatar_filename = secure_filename(avatar.filename)
        avatar_path = os.path.join(current_app.config['AVATAR_FOLDER'], avatar_filename)
        os.makedirs(current_app.config['AVATAR_FOLDER'], exist_ok=True)
        avatar.save(avatar_path)

    new_user = User(
        name=name,
        email=email,
        password=generate_password_hash(password, method='pbkdf2:sha256'),
        role=role,
        avatar=avatar_filename  # store only filename
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):
        pref_data = None
        if user.preference:
            pref_data = {
                "id": str(user.preference.id),
                "spice_level": user.preference.spice_level,
                "calories": user.preference.calories,
                "price": user.preference.price,
                "gluten_free": user.preference.gluten_free,
                "vegetarian": user.preference.vegetarian,
                "allergies": [str(a.id) for a in user.preference.allergies]
            }

        # 👇 Add avatar URL if it exists
        avatar_url = None
        if user.avatar:
            avatar_url = f"{request.host_url.rstrip('/')}/static/avatars/{user.avatar}"
        else:
            # Provide a default avatar URL when no avatar is available
            avatar_url = f"{request.host_url.rstrip('/')}/static/avatars/default-avatar.jpg"

        return jsonify({
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "avatar": avatar_url  # 👈 Add this field
            },
            "preferences": pref_data
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
