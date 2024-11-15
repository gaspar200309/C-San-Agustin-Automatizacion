import React, { useState, useEffect } from 'react';
import Modal from '../../components/modal/Modal';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TeacherSelector from '../selected/TeacherSelector';
import StatusSelect from '../selected/StatusSelect';
import Select from '../selected/Select';
import { Button } from '../buttons/Button';
import Table from '../table/Table';
import { getStatusIndicator8, registerStatusIndicador8 } from '../../api/api';
import PeriodoSelect from '../selected/PeriodoSelect';

const validationSchema = Yup.object({
  profesor: Yup.string().required('Requerido'),
  period: Yup.string().oneOf(['1', '2', '3', '4', '5', '6'], 'Seleccione una opción válida').required('Requerido'),
  status: Yup.string().required('Requerido'),
});
const Indicator8 = () => {
  const [professors, setProfessors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getStatusIndicator8();
      const mappedProfessors = mapDataToTableFormat(response.data.evaluations);
      console.log(mappedProfessors)
      setProfessors(mappedProfessors);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const mapDataToTableFormat = (evaluations) => {
    const professorMap = {};
  
    evaluations.forEach((evaluation) => {
      const teacherName = `${evaluation.teacher.name} ${evaluation.teacher.last_name}`;
      const periodId = evaluation.period.id;
      const status = evaluation.state.name;
  
      if (!professorMap[teacherName]) {
        professorMap[teacherName] = { name: teacherName, periods: {} };
      }
  
      professorMap[teacherName].periods[periodId] = status;
    });
  
    return Object.values(professorMap);
  };
  
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        indicator_id: 9, // ID fijo del indicador TODO ESTO ES TEMPORALMENTO PORQUE SOLO ES POR ORDEN QUE SE ALMACENO EN LA BASE DE DATOS 
        teacher_id: parseInt(values.profesor), // Actualizado
        period_id: parseInt(values.period), // Actualizado
        state_id: parseInt(values.status) // Actualizado
      };

      await registerStatusIndicador8(data);
      await fetchData();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  }; 

  const columns = [
    { header: 'Profesor', accessor: 'name' },
    { header: 'Periodo 1', accessor: 'period1', render: (row) => row.periods['1'] || 'N/A' },
    { header: 'Periodo 2', accessor: 'period2', render: (row) => row.periods['2'] || 'N/A' },
    { header: 'Periodo 3', accessor: 'period3', render: (row) => row.periods['3'] || 'N/A' },
    { header: 'Periodo 4', accessor: 'period4', render: (row) => row.periods['4'] || 'N/A' },
    { header: 'Periodo 5', accessor: 'period5', render: (row) => row.periods['5'] || 'N/A' },
    { header: 'Periodo 6', accessor: 'period6', render: (row) => row.periods['6'] || 'N/A' },
  ];

  return (
    <div className="indicator-container">
        <h2>Nivel de cumplimiento en la entrega de Reporte Académico de Alerta Temprana (RAAT)</h2>

      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Estado de Nota</button>
      
      <Table columns={columns} data={professors} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Nivel de cumplimiento en la entrega de Reporte Académico de Alerta Temprana (RAAT)</h2>
        <Formik
          initialValues={{ profesor: '', period: '', status: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="form">
              <TeacherSelector
                name="profesor"
                value={values.profesor}
                onChange={(e) => setFieldValue('profesor', e.target.value)}
                required={true}
              />
              <PeriodoSelect
                  name="period"
                  label={'Periodo'}
                  value={values.period}
                  onChange={(e) => setFieldValue('period', e.target.value)}
                  required={true}
                />

              <StatusSelect
                name="status"
                label={'Estado de Nota'}
                value={values.status}
                onChange={(e) => setFieldValue('status', e.target.value)}
                required={true}
              />
              <Button type="submit">Agregar Estado</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};
export default Indicator8;