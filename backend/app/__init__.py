from flask import Flask
from .config import Config
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config.from_object(Config)

    from app.routes import bijoux_bp, orders_bp
    app.register_blueprint(bijoux_bp)
    app.register_blueprint(orders_bp)


    return app
