import os

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True

    # Absolute path to the 'static' folder
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    STATIC_FOLDER = os.path.join(BASE_DIR, 'static')

    # Subfolders inside 'static'
    AVATAR_FOLDER = os.path.join(STATIC_FOLDER, 'avatars')
    DISH_IMAGE_FOLDER = os.path.join(STATIC_FOLDER, 'images')

    @staticmethod
    def init_app(app):
        app.config['SQLALCHEMY_DATABASE_URI'] = (
            f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
            f"{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
        )
        app.config['AVATAR_FOLDER'] = Config.AVATAR_FOLDER
        app.config['DISH_IMAGE_FOLDER'] = Config.DISH_IMAGE_FOLDER
