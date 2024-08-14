from flask import Blueprint
from ..controllers.user_controller import register_user, get_users, get_user, update_user_info, delete_user_info

user_routes_bp = Blueprint('user_routes', __name__)

user_routes_bp.route('/register', methods=['POST'])(register_user)
user_routes_bp.route('/users', methods=['GET'])(get_users)
user_routes_bp.route('/users/<int:user_id>', methods=['GET'])(get_user)
user_routes_bp.route('/users/<int:user_id>', methods=['PUT'])(update_user_info)
user_routes_bp.route('/users/<int:user_id>', methods=['DELETE'])(delete_user_info)
