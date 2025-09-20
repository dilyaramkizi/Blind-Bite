import os
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import db

from routes import register_routes
from file_upload.upload import file_bp
from config import Config

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_url_path='/static', static_folder='static')
app.config.from_object(Config)
Config.init_app(app)  # ← Load DB URI AFTER dotenv


# Create necessary directories for file uploads if they don't exist
os.makedirs(app.config['AVATAR_FOLDER'], exist_ok=True)
os.makedirs(app.config['DISH_IMAGE_FOLDER'], exist_ok=True)


# Enable CORS
CORS(app, resources={r"/*": {
    "origins": ["http://localhost:3000"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Register blueprints
app.register_blueprint(file_bp)
register_routes(app)

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=8000)
