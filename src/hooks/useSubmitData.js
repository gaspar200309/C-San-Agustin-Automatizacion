import React from 'react';
import { Formik, Form } from 'formik';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import { Button } from '../../components/buttons/Button';
import useFetchData from '../../hooks/useFetchData'; 
import useSubmitData from '../../hooks/useSubmitData';  
import { getAcademyObjetive, getSGCAcademi, addIndicator } from '../../api/api'; 
import * as Yup from 'yup';

const RegisterIndicator = () => {
  const { data: academicObjectives, loading: loadingAcademy, error: errorAcademy } = useFetchData(getAcademyObjetive);
  const { data: sgcObjectives, loading: loadingSGC, error: errorSGC } = useFetchData(getSGCAcademi);

  const { loading: submitting, error: submitError, success, submitData } = useSubmitData(addIndicator); 

  const validationSchema = Yup.object({
    name: Yup.string().required('Nombre es requerido'),
    due_date: Yup.date().required('Fecha de vencimiento es requerida'),
    expected_result: Yup.string().required('Resultado esperado es requerido'),
    academic_objective_id: Yup.number().required('El objetivo académico es requerido'),
    sgc_objective_id: Yup.number().required('El objetivo SGC es requerido'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    await submitData(values);
    setSubmitting(false);
  };

  if (loadingAcademy || loadingSGC) return <p>Cargando...</p>;
  if (errorAcademy || errorSGC) return <p>Error cargando los objetivos.</p>;

  return (
    <Formik
      initialValues={{
        name: '',
        delivery_deadline: '',
        due_date: '',
        improvement_action: '',
        expected_result: '',
        academic_objective_id: '',
        sgc_objective_id: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputText name="name" label="Nombre del Indicador" required />
          <InputText name="delivery_deadline" label="Fecha Límite de Entrega" type="date" />
          <InputText name="due_date" label="Fecha de Vencimiento" type="date" required />
          <InputText name="improvement_action" label="Acción de Mejora" />
          <InputText name="expected_result" label="Resultado Esperado" required />
          
          <Select name="academic_objective_id" label="Objetivo Académico" required>
            <option value="">Seleccione un objetivo</option>
            {academicObjectives.map((obj) => (
              <option key={obj.id} value={obj.id}>
                {obj.name}
              </option>
            ))}
          </Select>

          <Select name="sgc_objective_id" label="Objetivo SGC" required>
            <option value="">Seleccione un objetivo</option>
            {sgcObjectives.map((obj) => (
              <option key={obj.id} value={obj.id}>
                {obj.name}
              </option>
            ))}
          </Select>

          <Button type="submit" disabled={isSubmitting || submitting}>
            {isSubmitting || submitting ? 'Guardando...' : 'Registrar Indicador'}
          </Button>

          {submitError && <p style={{ color: 'red' }}>Error: {submitError.message}</p>}
          {success && <p style={{ color: 'green' }}>Indicador registrado exitosamente</p>}
        </Form>
      )}
    </Formik>
  );
};

export default RegisterIndicator;
