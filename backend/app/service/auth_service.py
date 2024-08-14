import jwt
from datetime import datetime, timedelta, timezone
from werkzeug.security import check_password_hash
from app import db
from models.usuario import Usuario
from flask import current_app

class AuthService:
    @staticmethod
    def verify_password(password_hash, password):
        return check_password_hash(password_hash, password)
    
    @staticmethod
    def generate_jwt(user):
        payload = {
            'user_id': user.id,
            'exp': datetime.now(timezone.utc) + timedelta(days=1),
            'iat': datetime.now(timezone.utc)
        }
        return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

    @staticmethod
    def decode_jwt(token):
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None