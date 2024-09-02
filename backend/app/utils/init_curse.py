def init_curso(app):
    with app.app_context():
        from app.models.coures import Course, Level, Parallel, CourseParallel
        from app import db 

        cursos = [
            {"name": "Sexto A", "level_name": "Primaria", "parallel_name": "A"},
            {"name": "Sexto B", "level_name": "Primaria", "parallel_name": "B"},
            {"name": "Sexto C", "level_name": "Primaria", "parallel_name": "C"},
            {"name": "Sexto D", "level_name": "Primaria", "parallel_name": "D"},
            {"name": "Primero A", "level_name": "Secundaria", "parallel_name": "A"},
            {"name": "Primero B", "level_name": "Secundaria", "parallel_name": "B"},
            {"name": "Primero C", "level_name": "Secundaria", "parallel_name": "C"},
            {"name": "Primero D", "level_name": "Secundaria", "parallel_name": "D"},
            {"name": "Segundo A", "level_name": "Secundaria", "parallel_name": "A"},
            {"name": "Segundo B", "level_name": "Secundaria", "parallel_name": "B"},
            {"name": "Segundo C", "level_name": "Secundaria", "parallel_name": "C"},
            {"name": "Segundo D", "level_name": "Secundaria", "parallel_name": "D"},
            {"name": "Tercero A", "level_name": "Secundaria", "parallel_name": "A"},
            {"name": "Tercero B", "level_name": "Secundaria", "parallel_name": "B"},
            {"name": "Tercero C", "level_name": "Secundaria", "parallel_name": "C"},
            {"name": "Tercero D", "level_name": "Secundaria", "parallel_name": "D"},
            {"name": "Cuarto A", "level_name": "Secundaria", "parallel_name": "A"},
            {"name": "Cuarto B", "level_name": "Secundaria", "parallel_name": "B"},
            {"name": "Cuarto C", "level_name": "Secundaria", "parallel_name": "C"},
            {"name": "Cuarto D", "level_name": "Secundaria", "parallel_name": "D"},
            {"name": "Quinto A", "level_name": "Secundaria", "parallel_name": "A"},
            {"name": "Quinto B", "level_name": "Secundaria", "parallel_name": "B"},
            {"name": "Quinto C", "level_name": "Secundaria", "parallel_name": "C"},
            {"name": "Quinto D", "level_name": "Secundaria", "parallel_name": "D"},
            {"name": "Sexto A", "level_name": "Avanzado", "parallel_name": "A"},
            {"name": "Sexto B", "level_name": "Avanzado", "parallel_name": "B"},
            {"name": "Sexto C", "level_name": "Avanzado", "parallel_name": "C"},
            {"name": "Sexto D", "level_name": "Avanzado", "parallel_name": "D"},
        ]

        for curso_data in cursos:
            level = Level.query.filter_by(name=curso_data['level_name']).first()
            parallel = Parallel.query.filter_by(name=curso_data['parallel_name']).first()
            if level and parallel:
                curso = Course.query.filter_by(name=curso_data['name'], level_id=level.id).first()
                if not curso:
                    new_curso = Course(name=curso_data['name'], level_id=level.id)
                    db.session.add(new_curso)
                    db.session.commit()  # Commit after adding the course to get its ID
                    curso = new_curso

                # Now associate the course with its parallel
                course_parallel = CourseParallel.query.filter_by(course_id=curso.id, parallel_id=parallel.id).first()
                if not course_parallel:
                    new_course_parallel = CourseParallel(course_id=curso.id, parallel_id=parallel.id)
                    db.session.add(new_course_parallel)
        db.session.commit()
