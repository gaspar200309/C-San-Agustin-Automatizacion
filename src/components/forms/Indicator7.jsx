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
import { getStatusIndicator7, registerStatusIndicador7 } from '../../api/api';

const validationSchema = Yup.object({
  profesor: Yup.string().required('Requerido'),
  period: Yup.string().oneOf(['1', '2', '3', '4', '5', '6'], 'Seleccione una opción válida').required('Requerido'),
  status: Yup.string().required('Requerido'),
});
const Indicator7 = () => {
  const { id } = useParams();
  const [professors, setProfessors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getStatusIndicator7(id);
      const mappedProfessors = mapDataToTableFormat(response.data.evaluations);
      setProfessors(mappedProfessors);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        indicator_id: 7, // ID fijo del indicador
        teacher_id: parseInt(values.profesor), // Actualizado
        period_id: parseInt(values.period), // Actualizado
        state_id: parseInt(values.status) // Actualizado
      };

      await registerStatusIndicador7(data);
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
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Estado de Nota</button>
      
      <Table columns={columns} data={professors} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Registrar Estado de Nota</h2>
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
              <Select label="Periodo" name="period" required={true}>
                <option value="">Seleccione un periodo</option>
                <option value="1">Perio</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </Select>
              <StatusSelect
                name="status"
                label={"Estado"}
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
export default Indicator7;