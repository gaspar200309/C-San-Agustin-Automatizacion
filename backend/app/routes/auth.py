from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models import Usuario

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    print(email)
    print(password)
    user = Usuario.query.filter_by(email=email).first()
    if user and user.password == password:
        access_token = create_access_token(identity={'email': user.email})
        response = jsonify(access_token=access_token)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    else:
        return jsonify({"msg": "Invalid credentials"}), 401
