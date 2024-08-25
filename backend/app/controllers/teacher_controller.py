# app/controllers/teacher_controller.py

from flask import Blueprint, request, jsonify
from app.service.teacher_service import create_teacher, assign_teacher_to_coordinator, get_all_teachers

teacher_bp = Blueprint('teacher_bp', __name__)

@teacher_bp.route('/teachers', methods=['POST'])
def register_teacher():
    data = request.get_json()
    print(data)
    name = data.get('name')
    last_name = data.get('last_name')
    if not name or not last_name:
        return jsonify({"error": "Name and Last Name are required"}), 400
    teacher = create_teacher(name, last_name)
    return jsonify({"id": teacher.id, "name": teacher.name, "last_name": teacher.last_name}), 201

@teacher_bp.route('/teachers/<int:teacher_id>/assign', methods=['POST'])
def assign_teacher(teacher_id):
    data = request.get_json()
    coordinator_id = data.get('coordinator_id')
    if not coordinator_id:
        return jsonify({"error": "Coordinator ID is required"}), 400
    
    assignment = assign_teacher_to_coordinator(teacher_id, coordinator_id)
    if not assignment:
        return jsonify({"error": "Invalid Teacher or Coordinator ID"}), 404
    
    return jsonify({"message": "Teacher assigned successfully"}), 200

@teacher_bp.route('/teachers', methods=['GET'])
def list_teachers():
    teachers = get_all_teachers()
    return jsonify([{"id": teacher.id, "name": teacher.name, "last_name": teacher.last_name} for teacher in teachers]), 200
