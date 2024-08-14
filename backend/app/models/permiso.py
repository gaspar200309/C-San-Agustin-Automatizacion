from app import db
from sqlalchemy.orm import relationship

class Permiso(db.Model):
    __tablename__ = 'permisos'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True, nullable=False)
    roles = relationship('PermisoRol', back_populates='permiso')
