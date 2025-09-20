from .auth import auth_bp
from .allergies import allergy_bp
from .orders import orders_bp
from .menu import menu_bp
from .preferences import preferences_bp
from .users import user_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(allergy_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(preferences_bp)
    app.register_blueprint(user_bp)
