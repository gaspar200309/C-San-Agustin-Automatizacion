from app import db

class PermisoRol(db.Model):
    __tablename__ = 'permiso_roles'
    
    id = db.Column(db.Integer, primary_key=True)
    rol_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    permiso_id = db.Column(db.Integer, db.ForeignKey('permisos.id'))

    rol = db.relationship('Rol', back_populates='permisos')
    permiso = db.relationship('Permiso', back_populates='roles')
