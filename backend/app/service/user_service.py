from app.models.user import User, Role, Teacher, UserRole, db

class UserService:
    @staticmethod
    def get_all_users():
        return User.query.all()
    
    @staticmethod
    def get_rol():
        return Role.query.all()

    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def create_user(username, email, password, role_ids):
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        for role_id in role_ids:
            user_role = UserRole(user_id=new_user.id, role_id=role_id)
            db.session.add(user_role)
        db.session.commit()
        return new_user

    @staticmethod
    def update_user(user_id, username, email, role_ids):
        user = User.query.get(user_id)
        if user:
            user.username = username
            user.email = email
            UserRole.query.filter_by(user_id=user_id).delete()
            for role_id in role_ids:
                user_role = UserRole(user_id=user_id, role_id=role_id)
                db.session.add(user_role)
            db.session.commit()
            return user
        return None

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if user:
            UserRole.query.filter_by(user_id=user_id).delete()
            db.session.delete(user)
            db.session.commit()
            return True
        return False

    @staticmethod
    def get_all_roles():
        return Role.query.all()

class TeacherService:
    @staticmethod
    def get_all_teachers():
        return Teacher.query.all()

    @staticmethod
    def create_teacher(name, last_name):
        new_teacher = Teacher(name=name, last_name=last_name)
        db.session.add(new_teacher)
        db.session.commit()
        return new_teacher
