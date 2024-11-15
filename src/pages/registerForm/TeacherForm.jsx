import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../components/inputs/InputText";
import { Button } from "../../components/buttons/Button";
import { registerTeacher } from "../../api/api";
import CourseModal from "../../components/selected/ModalCurse";
import "./TeacherForm.css";

const TeacherForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    firstName: '',
    lastName: '',
    courses: [],  
    subjects: '',
  };
  
  const validationSchema = Yup.object({
    firstName: Yup.string().required('Nombre es requerido'),
    lastName: Yup.string().required('Apellidos son requeridos'),
    courses: Yup.array().min(1, 'Seleccione al menos un curso'), 
    subjects: Yup.string().required('Seleccione una materia'),
  });
  
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      subjects: values.subjects,
      course_ids: values.courses,  
    };
    
    try {
      await registerTeacher(data); 
      navigate('/listTeacher'); 
    } catch (error) {
      setFieldError('general', 'Error al registrar el profesor');
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
      {({ values, setFieldValue, isSubmitting, errors }) => ( 
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

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Registrar Profesor
          </Button>
          {errors.general && <p className="error-message">{errors.general}</p>}
        </Form>
      )}
    </Formik>
  );
};

export default TeacherForm;
