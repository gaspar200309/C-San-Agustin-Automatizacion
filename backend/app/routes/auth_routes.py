from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from service.auth_service import AuthService
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Usuario.query.filter_by(username=data['username']).first()

    if user and AuthService.verify_password(user.password_hash, data['password']):
        token = AuthService.generate_jwt(user)
        return jsonify({'token': token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = Usuario(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201
