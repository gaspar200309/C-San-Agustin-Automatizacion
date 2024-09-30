import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../../components/inputs/InputText";
import { Button } from "../../components/buttons/Button";
import { updateTeacher, getTeacherById } from "../../api/api";
import CourseSelect from "../../components/selected/CourseSelect";
import useSubmitData from "../../hooks/useSubmitData";
import "./TeacherForm.css";

const EditTeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { submitData, loading: submitLoading, error: submitError, success } = useSubmitData(updateTeacher);

  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    course: '',
    subjects: '',
  });

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
          course: data.courses[0]?.course_id || '',
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
    course: Yup.string().required('Seleccione un curso'),
    subjects: Yup.string().required('Seleccione una materia'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    await submitData({ ...values, id });
    if (success) {
      resetForm();
      navigate("/listTeacher");
    }
    setSubmitting(false);
  };

  if (fetchLoading) return <p>Cargando...</p>;
  if (fetchError) return <p>Error: {fetchError.message}</p>;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      <Form className="register-teacher-form">
        <h3>Editar Profesor</h3>
        <InputText label="Nombre" name="firstName" required />
        <InputText label="Apellidos" name="lastName" required />
        <InputText label="Asignatura" name="subjects" required />
        <CourseSelect label="Cursos" name="course" required />
        <Button variant="primary" type="submit" disabled={submitLoading}>
          Guardar Cambios
        </Button>
        {submitError && <p className="error-message">Error: {submitError.message}</p>}
      </Form>
    </Formik>
  );
};

export default EditTeacherForm;
