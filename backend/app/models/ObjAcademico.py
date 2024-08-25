from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .. import db

class AcademicObjective(db.Model):
    __tablename__ = 'academic_objectives'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(250), nullable=False)
    indicators = relationship('Indicator', back_populates='academic_objective')

class SGCObjective(db.Model):
    __tablename__ = 'sgc_objectives'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(250), nullable=False)
    indicators = relationship('Indicator', back_populates='sgc_objective')
