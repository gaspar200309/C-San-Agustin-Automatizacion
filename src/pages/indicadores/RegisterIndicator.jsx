import { Formik, Form, FieldArray } from 'formik';
import { useNavigate } from 'react-router-dom';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import { Button } from '../../components/buttons/Button';
import useFetchData from '../../hooks/useFetchData';
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
    expected_result: Yup.string().required('Resultado esperado es requerido'),
    academic_objective_id: Yup.number().required('El objetivo académico es requerido'),
    sgc_objective_id: Yup.number().required('El objetivo SGC es requerido'),
    formula_id: Yup.number().required('La fórmula es requerida'),
    deadlines: Yup.array().of(
      Yup.object({
        delivery_date: Yup.date().required('Fecha de entrega es requerida'),
        period_type: Yup.string().required('Tipo de periodo es requerido')
      })
    )
  });

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await addIndicator(values);
      setStatus({ success: 'Indicador registrado exitosamente' });
      navigate('/list-indicador/asignerCordinator'); 
    } catch (error) {
      setStatus({ error: 'Error al registrar el indicador' });
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
            improvement_action: '',
            expected_result: '',
            academic_objective_id: '',
            sgc_objective_id: '',
            formula_id: '',
            deadlines: [{ delivery_date: '', period_type: '' }]
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, values }) => (
            <Form>
              <InputText name="name" label="Nombre del Indicador" required className="input-text" />
              <FieldArray name="deadlines">
            {({ push, remove }) => (
              <div>
                {values.deadlines.map((_, index) => (
                  <div key={index}>
                    <InputText name={`deadlines[${index}].delivery_date`} type="date" label="Fecha de Entrega" />
                    <Select name={`deadlines[${index}].period_type`} label="Tipo de Periodo">
                      <option value="">Seleccione un periodo</option>
                      <option value="Anual">Anual</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Trimestral">Trimestral</option>
                      <option value="Mensual">Mensual</option>
                      <option value="Personalizado">Personalizado</option>
                    </Select>
                    <Button type="button" onClick={() => remove(index)}>Eliminar</Button>
                  </div>
                ))}
                <Button type="button" onClick={() => push({ delivery_date: '', period_type: '' })}>
                  Agregar Fecha de Entrega
                </Button>
              </div>
            )}
          </FieldArray>
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Registrar Indicador'}
                </Button>
                {status && status.success && <p className="success-message">{status.success}</p>}
                {status && status.error && <p className="error-message">{status.error}</p>}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterIndicator;
