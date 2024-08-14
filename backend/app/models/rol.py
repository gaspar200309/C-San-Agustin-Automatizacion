from app import db
from sqlalchemy.orm import relationship

class Rol(db.Model):
    __tablename__ = 'roles'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), unique=True, nullable=False)
    usuarios = relationship('UsuarioRol', back_populates='rol')
    permisos = relationship('PermisoRol', back_populates='rol')
