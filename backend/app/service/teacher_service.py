# app/services/teacher_service.py

from app.models.user import Teacher, CoordinatorTeacherAssignment, User, Role
from app import db

def create_teacher(name, last_name):
    teacher = Teacher(name=name, last_name=last_name)
    db.session.add(teacher)
    db.session.commit()
    return teacher

def assign_teacher_to_coordinator(teacher_id, coordinator_id):
    teacher = Teacher.query.get(teacher_id)
    coordinator = User.query.get(coordinator_id)
    if not teacher or not coordinator:
        return None
    assignment = CoordinatorTeacherAssignment(teacher_id=teacher.id, coordinator_id=coordinator.id)
    db.session.add(assignment)
    db.session.commit()
    return assignment

def get_all_teachers():
    return Teacher.query.all()
