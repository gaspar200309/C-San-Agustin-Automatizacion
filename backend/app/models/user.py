from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .. import db


user_indicator = Table('user_indicator', db.Model.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('indicator_id', Integer, ForeignKey('indicators.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(512), nullable=False)
    roles = relationship('UserRole', back_populates='user')
    coordinator_assignments = relationship('CoordinatorTeacherAssignment', back_populates='coordinator')
    indicators = relationship('Indicator', secondary=user_indicator, back_populates='users')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Role(db.Model):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    permissions = relationship('Permission', back_populates='role')
    users = relationship('UserRole', back_populates='role')

class Permission(db.Model):
    __tablename__ = 'permissions'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    role_id = Column(Integer, ForeignKey('roles.id'))
    role = relationship('Role', back_populates='permissions')

class UserRole(db.Model):
    __tablename__ = 'user_roles'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))
    user = relationship('User', back_populates='roles')
    role = relationship('Role', back_populates='users')

teacher_course_parallel = Table('teacher_course_parallel', db.Model.metadata,
    Column('teacher_id', Integer, ForeignKey('teachers.id'), primary_key=True),
    Column('course_parallel_id', Integer, ForeignKey('course_parallels.id'), primary_key=True)
)


class Teacher(db.Model):
    __tablename__ = 'teachers'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    assignments = relationship('CoordinatorTeacherAssignment', back_populates='teacher')
    course_parallels = relationship('CourseParallel', secondary=teacher_course_parallel, back_populates='teachers')

class CoordinatorTeacherAssignment(db.Model):
    __tablename__ = 'coordinator_teacher_assignments'
    id = Column(Integer, primary_key=True)
    teacher_id = Column(Integer, ForeignKey('teachers.id'))
    coordinator_id = Column(Integer, ForeignKey('users.id'))
    teacher = relationship('Teacher', back_populates='assignments')
    coordinator = relationship('User', back_populates='coordinator_assignments')
    
