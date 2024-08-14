from app import db

class UsuarioRol(db.Model):
    __tablename__ = 'usuario_roles'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    rol_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    usuario = db.relationship('Usuario', back_populates='roles')
    rol = db.relationship('Rol', back_populates='usuarios')
