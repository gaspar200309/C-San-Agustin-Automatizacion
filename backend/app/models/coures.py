from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from app.models.user import teacher_course_parallel
from .. import db 

class Course(db.Model):
    __tablename__ = 'courses'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    grade = Column(String(50), nullable=False)
    description = Column(String(250), nullable=False)
    paralelos = relationship('CourseParallel', back_populates='course')

class Parallel(db.Model):
    __tablename__ = 'parallels'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    courses = relationship('CourseParallel', back_populates='parallel')

class CourseParallel(db.Model):
    __tablename__ = 'course_parallels'
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'))
    parallel_id = Column(Integer, ForeignKey('parallels.id'))
    course = relationship('Course', back_populates='paralelos')
    parallel = relationship('Parallel', back_populates='courses')
    teachers = relationship('Teacher', secondary=teacher_course_parallel, back_populates='course_parallels')
