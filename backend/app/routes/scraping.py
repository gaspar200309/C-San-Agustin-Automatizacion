from flask import Blueprint, request, jsonify
from app.scraping import scrape_data
from flask_jwt_extended import jwt_required

main_bp = Blueprint('main_bp', __name__)

@main_bp.route('/api/scrape', methods=['POST'])
@jwt_required()
def scrape():
    credentials = request.json
    data = scrape_data(credentials['email'], credentials['password'])
    return jsonify(data)
