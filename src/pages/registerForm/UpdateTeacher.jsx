import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../components/inputs/InputText";
import { Button } from "../../components/buttons/Button";
import { updateTeacher, getTeacherById } from "../../api/api";
import "./TeacherForm.css";
import CourseModal from "../../components/selected/ModalCurse";

const EditTeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    courses: [],
    subjects: '',
  });
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      setFetchLoading(true);
      try {
        const { data } = await getTeacherById(id);
        setInitialValues({
          firstName: data.name || '',
          lastName: data.last_name || '',
          courses: data.courses.map(course => course.course_id) || [], // Convertimos los cursos a array de IDs
          subjects: data.asignatura || '',
        });
      } catch (error) {
        setFetchError(error);
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchTeacher();
  }, [id]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Nombre es requerido'),
    lastName: Yup.string().required('Apellidos son requeridos'),
    courses: Yup.array().min(1, 'Seleccione al menos un curso').required('Seleccione cursos'),
    subjects: Yup.string().required('Seleccione una materia'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitLoading(true);
    setSubmitError(null);
    
    try {
      // Preparar los datos para el backend
      const teacherData = {
        firstName: values.firstName,
        lastName: values.lastName,
        subjects: values.subjects,
        course_ids: values.courses // Enviamos el array de IDs de cursos
      };
      
      await updateTeacher(id, teacherData);
      navigate("/listTeacher");
    } catch (error) {
      setSubmitError(error);
    } finally {
      setSubmitLoading(false);
      setSubmitting(false);
    }
  };

  if (fetchLoading) return <div className="loading">Cargando...</div>;
  if (fetchError) return <div className="error">Error: {fetchError.message}</div>;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="register-teacher-form">
          <h3>Editar Profesor</h3>
          
          <InputText 
            label="Nombre" 
            name="firstName" 
            required 
          />
          
          <InputText 
            label="Apellidos" 
            name="lastName" 
            required 
          />
          
          <InputText 
            label="Asignatura" 
            name="subjects" 
            required 
          />
          
          <CourseModal
            name="courses"
            label="Cursos"
            selectedCourses={values.courses}
            onChange={(selectedCourses) => {
              setFieldValue('courses', selectedCourses);
            }}
          />
          {errors.courses && touched.courses && (
            <div className="error-message">{errors.courses}</div>
          )}
          
          <div className="form-footer">
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => navigate("/listTeacher")}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={submitLoading}
            >
              {submitLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
          
          {submitError && (
            <div className="error-message">
              Error: {submitError.message}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default EditTeacherForm;