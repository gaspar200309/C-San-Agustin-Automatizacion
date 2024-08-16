from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .config import config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def init_roles(app):
    with app.app_context():
        from app.models.user import Role
        roles = ['Administrador', 'Usuario'] 
        for role_name in roles:
            role = Role.query.filter_by(name=role_name).first()
            if not role:
                new_role = Role(name=role_name)
                db.session.add(new_role)
        db.session.commit()

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    CORS(app, resources={r"/*": {"origins": config.CORS_ORIGINS}}, supports_credentials=True)

    with app.app_context():
        from app.models.user import User, Permission, UserRole, Role
        from .routes.auth_routes import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/auth')
        db.create_all()
        init_roles(app)

    return app