import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import { Button } from '../../components/buttons/Button';
import { getCourses, registerTeacher } from '../../api/api';
import './TeacherForm.css';

const TeacherForm = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }
    fetchCourses();
  }, []);

  const uniqueCourses = useMemo(() => {
    return [...new Map(courses.map(item => [item.course_name, item])).values()];
  }, [courses]);

  const uniqueParallels = useMemo(() => {
    return [...new Set(courses.map(item => item.parallel_name))];
  }, [courses]);

  const initialValues = {
    firstName: '',
    lastName: '',
    course: '',
    parallel: '',
    subjects: '',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Nombre es requerido'),
    lastName: Yup.string().required('Apellidos son requeridos'),
    course: Yup.string().required('Seleccione un curso'),
    parallel: Yup.string().required('Seleccione un paralelo'),
    subjects: Yup.string().required('Seleccione una materia'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await registerTeacher(values);
      console.log('Teacher registered successfully');
      resetForm();
    } catch (error) {
      console.error('Error registering teacher:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="register-teacher-form">
        <InputText label="Nombre" name="firstName" required />
        <InputText label="Apellidos" name="lastName" required />

        <Select label="Cursos" name="course" required>
          <option value="">Seleccione un curso</option>
          {uniqueCourses.map(course => (
            <option key={course.course_name} value={course.course_name}>
              {course.course_name} - {course.level_name}
            </option>
          ))}
        </Select>

        <Select label="Paralelos" name="parallel" required>
          <option value="">Seleccione un paralelo</option>
          {uniqueParallels.map(parallel => (
            <option key={parallel} value={parallel}>
              {parallel}
            </option>
          ))}
        </Select>

        <Select label="Materias" name="subjects" required>
          <option value="">Seleccione una materia</option>
          <option value="matematica">Matemática</option>
          <option value="ciencia">Ciencia</option>
          <option value="lenguaje">Lenguaje</option>
        </Select>

        <Button variant="primary" type="submit">Registrar Profesor</Button>
      </Form>
    </Formik>
  );
};

export default TeacherForm;
