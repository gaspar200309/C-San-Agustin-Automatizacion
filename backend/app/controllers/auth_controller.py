from flask import Blueprint, request, jsonify
from app.service.auth_service import create_user, authenticate_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("jajaj")
        print(data)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role_name = data.get('role')

        user, message = create_user(username, email, password, role_name)
        if user:
            return jsonify({"message": message}), 201
        return jsonify({"error": message}), 400
    except Exception as e:
        print(f"Error in register route: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data, "ss")
    identifier = data.get('identifier')  # Cambia 'username' por 'identifier'
    password = data.get('password')

    token, message = authenticate_user(identifier, password)
    if token:
        return jsonify({"access_token": token}), 200
    return jsonify({"error": message}), 401
