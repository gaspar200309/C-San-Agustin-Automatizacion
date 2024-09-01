from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.models.user import user_indicator
from .. import db

class Indicator(db.Model):
    __tablename__ = 'indicators'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    delivery_deadline = Column(Date, nullable=True)
    due_date = Column(Date, nullable=False)
    improvement_action = Column(String(250))
    expected_result = Column(String(50), nullable=False)
    academic_objective_id = Column(Integer, ForeignKey('academic_objectives.id'))
    sgc_objective_id = Column(Integer, ForeignKey('sgc_objectives.id'))
    evaluations = relationship('Evaluation', back_populates='indicator')
    users = relationship('User', secondary=user_indicator, back_populates='indicators')

    # Add back_populates here to match the relationship in AcademicObjective and SGCObjective
    academic_objective = relationship('AcademicObjective', back_populates='indicators')
    sgc_objective = relationship('SGCObjective', back_populates='indicators')

class IndicatorState(db.Model):
    __tablename__ = 'indicator_states'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)

class Evaluation(db.Model):
    __tablename__ = 'evaluations'
    id = Column(Integer, primary_key=True)
    indicator_id = Column(Integer, ForeignKey('indicators.id'))
    indicator = relationship('Indicator', back_populates='evaluations')