import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputText from "../../components/inputs/InputText";
import { Button } from "../../components/buttons/Button";
import { registerTeacher } from "../../api/api";
import CourseModal from "../../components/selected/ModalCurse";
import useSubmitData from "../../hooks/useSubmitData";
import "./TeacherForm.css";

const TeacherForm = () => {
  const navigate = useNavigate();
  
  const { submitData, loading: submitLoading, error: submitError, success } = useSubmitData(registerTeacher);

  const initialValues = {
    firstName: '',
    lastName: '',
    courses: [],  // Array to store multiple selected courses
    subjects: '',
  };
  
  const validationSchema = Yup.object({
    firstName: Yup.string().required('Nombre es requerido'),
    lastName: Yup.string().required('Apellidos son requeridos'),
    courses: Yup.array().min(1, 'Seleccione al menos un curso'),  // Array validation for multiple courses
    subjects: Yup.string().required('Seleccione una materia'),
  });
  

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      subjects: values.subjects,
      course_ids: values.courses,  // Ensure multiple course IDs are sent to the backend
    };
  
    await submitData(data);
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
      {({ values, setFieldValue }) => ( 
        <Form className="register-teacher-form">
          <h3>Registrar Profesor</h3>
          <InputText label="Nombre" name="firstName" required />
          <InputText label="Apellidos" name="lastName" required />
          <InputText label="Asignatura" name="subjects" required />
          
          <CourseModal
            name="courses"
            label="Cursos"
            selectedCourses={values.courses}  
            onChange={(selectedCourses) => setFieldValue('courses', selectedCourses)} 
          />

          <Button variant="primary" type="submit" disabled={submitLoading}>
            Registrar Profesor
          </Button>
          {submitError && <p className="error-message">Error: {submitError.message}</p>}
        </Form>
      )}
    </Formik>
  );
};

export default TeacherForm;
