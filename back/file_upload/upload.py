import os
import uuid
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename

file_bp = Blueprint('file_uploads', __name__, url_prefix='/upload')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'avif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@file_bp.route('/avatar', methods=['POST'])
def upload_avatar():
    file = request.files.get('avatar')
    if file and allowed_file(file.filename):
        unique_name = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        path = os.path.join(current_app.config['AVATAR_FOLDER'], unique_name)
        file.save(path)
        return jsonify({'path': f'/static/avatars/{unique_name}'}), 200
    return jsonify({'error': 'Invalid file'}), 400

@file_bp.route('/dish-image', methods=['POST'])
def upload_dish_image():
    file = request.files.get('image')
    if file and allowed_file(file.filename):
        unique_name = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        path = os.path.join(current_app.config['DISH_IMAGE_FOLDER'], unique_name)
        file.save(path)
        return jsonify({'path': f'/static/images/{unique_name}'}), 200
    return jsonify({'error': 'Invalid file'}), 400

@file_bp.route('/avatars/<path:filename>')
def serve_avatars(filename):
    return send_from_directory(current_app.config['AVATAR_FOLDER'], filename)

@file_bp.route('/images/<path:filename>')
def serve_dish_images(filename):
    return send_from_directory(current_app.config['DISH_IMAGE_FOLDER'], filename)
