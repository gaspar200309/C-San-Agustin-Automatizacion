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
        roles = ['Administrador', 'Usuario', 'Cordinador'] 
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
        from app.models.user import User, Permission, UserRole, Role, Teacher, CoordinatorTeacherAssignment
        from app.models.Indicadores import Indicator, IndicatorState, Evaluation
        from app.models.peridos import Trimester, Period, Document
        from app.models.ObjAcademico import AcademicObjective, SGCObjective
        from app.models.coures import Course, Parallel, CourseParallel
        
        from .routes.auth_routes import auth_bp
        from app.controllers.teacher_controller import teacher_bp
        from app.controllers.user_controller import user_bp
        
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(teacher_bp, url_prefix='/api')
        app.register_blueprint(user_bp, url_prefix='/api')
                
        db.create_all()
        init_roles(app)

    return app