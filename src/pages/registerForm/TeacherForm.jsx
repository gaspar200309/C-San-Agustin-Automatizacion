import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../components/inputs/InputText";
import Select from "../../components/selected/Select";
import { Button } from "../../components/buttons/Button";
import { getCourses, registerTeacher} from "../../api/api";
import useFetchData from "../../hooks/useFetchData";
import "./TeacherForm.css";
import CourseSelect from "../../components/selected/CourseSelect";

const TeacherForm = () => {
  const { data: courses } = useFetchData(getCourses);

  const uniqueCourses = useMemo(() => {
    return [
      ...new Map(
        courses.map((item) => [item.course_id, item]) 
      ).values(),
    ];
  }, [courses]);

  const initialValues = {
    firstName: '',
    lastName: '',
    course: '',  
    subjects: '',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Nombre es requerido'),
    lastName: Yup.string().required('Apellidos son requeridos'),
    course: Yup.string().required('Seleccione un curso'),
    subjects: Yup.string().required('Seleccione una materia'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await registerTeacher(values);
      console.log("Profesor registrado con éxito");
      resetForm();
    } catch (error) {
      console.error("Error al registrar el profesor:", error);
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
        <h3>Registrar Profesor</h3>

        <InputText label="Nombre" name="firstName" required />
        <InputText label="Apellidos" name="lastName" required />
        <InputText label="Asignatura" name="subjects" required />

        <CourseSelect label="Cursos" name="course" required/>

        <Button variant="primary" type="submit">
          Registrar Profesor
        </Button>
      </Form>
    </Formik>
  );
};

export default TeacherForm;
