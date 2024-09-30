import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import { Button } from '../../components/buttons/Button';
import useFetchData from '../../hooks/useFetchData';
import useSubmitData from '../../hooks/useSubmitData';
import { getAcademyObjetive, getSGCAcademi, getFormulas, addIndicator } from '../../api/api';
import * as Yup from 'yup';
import './RegisterIndicator.css';

const RegisterIndicator = () => {
  const navigate = useNavigate();

  const { data: academicObjectives, loading: loadingAcademy, error: errorAcademy } = useFetchData(getAcademyObjetive);
  const { data: sgcObjectives, loading: loadingSGC, error: errorSGC } = useFetchData(getSGCAcademi);
  const { data: formulas, loading: loadingFormulas, error: errorFormulas } = useFetchData(getFormulas);

  const validationSchema = Yup.object({
    name: Yup.string().required('Nombre es requerido'),
    due_date: Yup.date().required('Fecha de vencimiento es requerida'),
    expected_result: Yup.string().required('Resultado esperado es requerido'),
    academic_objective_id: Yup.number().required('El objetivo académico es requerido'),
    sgc_objective_id: Yup.number().required('El objetivo SGC es requerido'),
    formula_id: Yup.number().required('La fórmula es requerida')
  });

  const { loading, error, submitData } = useSubmitData(addIndicator);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (loading) return; // No permitir que se ejecute si ya está en proceso

    console.log('Datos del formulario:', values);

    try {
      setSubmitting(true);
      const response = await submitData(values);
      if (response && response.success) {
        console.log('Registro exitoso:', response);
        navigate('/list-indicador');
      }
    } catch (err) {
      console.error('Error al registrar el indicador:', err);
    } finally {
      setSubmitting(false);
    }
  };


  if (loadingAcademy || loadingSGC || loadingFormulas) return <p>Cargando...</p>;
  if (errorAcademy || errorSGC || errorFormulas) return <p>Error cargando los datos.</p>;

  return (
    <div className="register-indicator-container">
      <h2 className="register-indicator-title">Registrar Indicadores</h2>
      <div className="form-container">
        <Formik
          initialValues={{
            name: '',
            delivery_deadline: '',
            due_date: '',
            improvement_action: '',
            expected_result: '',
            academic_objective_id: '',
            sgc_objective_id: '',
            formula_id: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputText name="name" label="Nombre del Indicador" required className="input-text" />
              <InputText name="delivery_deadline" label="Fecha Límite de Entrega" type="date" className="input-text" />
              <InputText name="due_date" label="Fecha de Vencimiento" type="date" required className="input-text" />
              <InputText name="improvement_action" label="Acción de Mejora" className="input-text" />
              <InputText name="expected_result" label="Resultado Esperado" required className="input-text" />

              <Select name="formula_id" label="Fórmulas" required className="select-input">
                <option value="">Seleccione una fórmula</option>
                {formulas.map((formula) => (
                  <option key={formula.id} value={formula.id}>
                    {formula.formula}
                  </option>
                ))}
              </Select>

              <Select name="academic_objective_id" label="Objetivo Académico" required className="select-input">
                <option value="">Seleccione un objetivo</option>
                {academicObjectives.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.name}
                  </option>
                ))}
              </Select>

              <Select name="sgc_objective_id" label="Objetivo SGC" required className="select-input">
                <option value="">Seleccione un objetivo</option>
                {sgcObjectives.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.name}
                  </option>
                ))}
              </Select>

              <div className="button-container">
                <Button type="submit" disabled={isSubmitting || loading}>
                  {loading ? 'Guardando...' : 'Registrar Indicador'}
                </Button>

                {error && <p className="error-message">Error: {error.message}</p>}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterIndicator;
