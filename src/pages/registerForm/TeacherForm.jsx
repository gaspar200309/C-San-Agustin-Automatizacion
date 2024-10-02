import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../components/inputs/InputText";
import { Button } from "../../components/buttons/Button";
import { registerTeacher } from "../../api/api";
import CourseSelect from "../../components/selected/CourseSelect";
import useSubmitData from "../../hooks/useSubmitData";
import "./TeacherForm.css";

const TeacherForm = () => {
  const navigate = useNavigate();
  
  const { submitData, loading: submitLoading, error: submitError, success } = useSubmitData(registerTeacher);

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
    await submitData(values);
    if (success) {
      navigate("/listTeacher");
      resetForm();
    }
    setSubmitting(false);
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
        <CourseSelect label="Cursos" name="course" required />
        <Button variant="primary" type="submit" disabled={submitLoading}>
          Registrar Profesor
        </Button>
        {submitError && <p className="error-message">Error: {submitError.message}</p>}
      </Form>
    </Formik>
  );
};

export default TeacherForm;
