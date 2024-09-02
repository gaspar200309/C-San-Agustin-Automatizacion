from app.models.coures import Course, Level, Parallel, CourseParallel
from app import db

def get_all_courses():
    courses = db.session.query(Course, Level, Parallel).join(Level, Course.level_id == Level.id)\
        .join(CourseParallel, Course.id == CourseParallel.course_id)\
        .join(Parallel, CourseParallel.parallel_id == Parallel.id).all()
    
    return [{
        "course_name": course.Course.name,
        "level_name": course.Level.name,
        "parallel_name": course.Parallel.name
    } for course in courses]