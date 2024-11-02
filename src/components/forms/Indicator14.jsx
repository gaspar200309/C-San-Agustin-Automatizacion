import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { registerIndicator14, getIndicator14Stats } from '../../api/api';
import SemesterSwitch from '../selected/SemesterSwitch';
import CourseSelect from '../selected/CourseSelect';
import TrimestreSelect from '../selected/TrimestreSelect';
import PeriodoSelect from '../selected/PeriodoSelect';
import StatusSelect from '../selected/StatusSelect';
import TeacherSelector from '../selected/TeacherSelector';
import Table from '../table/Table';
import { Button } from '../buttons/Button';
import Modal from '../modal/Modal';

const Indicator14 = () => {
  const [isTrimestre, setIsTrimestre] = useState(false);
  const [stats, setStats] = useState([]);
  const [generalStats, setGeneralStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Frontend: Modifica la función fetchData en Indicator14.js
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getIndicator14Stats();

      // Crear un mapa para agrupar por curso y profesor
      const groupedData = response.data.records.reduce((acc, record) => {
        // Crear una clave única para cada combinación de curso y profesor
        const key = `${record.course_id}-${record.teacher_name}`;

        if (!acc[key]) {
          // Inicializar el objeto con valores vacíos para todos los trimestres/periodos
          acc[key] = {
            course_id: record.course_id,
            course_name: record.course_name,
            teacher_name: record.teacher_name,
            trimestre1: '-',
            trimestre2: '-',
            trimestre3: '-',
            trimestre4: '-',
            periodo1: '-',
            periodo2: '-',
            periodo3: '-',
            periodo4: '-',
            periodo5: '-',
            periodo6: '-'
          };
        }

        // Actualizar el estado correspondiente
        if (record.trimestre_id) {
          acc[key][`trimestre${record.trimestre_id}`] = record.state_name;
        } else if (record.period_id) {
          acc[key][`periodo${record.period_id}`] = record.state_name;
        }

        return acc;
      }, {});

      // Convertir el mapa en un array
      const transformedData = Object.values(groupedData);

      setStats(transformedData);
      setGeneralStats(response.data.general);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        indicator_id: 14,
        course_id: parseInt(values.course_id),
        teacher_id: parseInt(values.teacher_id),
        state_id: parseInt(values.state_id),
        ...(isTrimestre ? { trimestre_id: parseInt(values.trimestre_id) } : { period_id: parseInt(values.period_id) }),
      };

      await registerIndicator14(data);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  // Dynamically define columns based on isTrimestre
  const columns = [
    { header: 'Curso', accessor: 'course_name' },
    { header: 'Profesor', accessor: 'teacher_name' },
    ...(isTrimestre
      ? [
        { header: 'Trimestre 1', accessor: 'trimestre1' },
        { header: 'Trimestre 2', accessor: 'trimestre2' },
        { header: 'Trimestre 3', accessor: 'trimestre3' },
        { header: 'Trimestre 4', accessor: 'trimestre4' },
      ]
      : [
        { header: 'Periodo 1', accessor: 'periodo1' },
        { header: 'Periodo 2', accessor: 'periodo2' },
        { header: 'Periodo 3', accessor: 'periodo3' },
        { header: 'Periodo 4', accessor: 'periodo4' },
        { header: 'Periodo 5', accessor: 'periodo5' },
        { header: 'Periodo 6', accessor: 'periodo6' },
      ]),
  ];

  return (
    <div className="indicator-container">
      <h3>Estadísticas del Indicador 14</h3>
      <SemesterSwitch isTrimestre={isTrimestre} onChange={setIsTrimestre} />

      <Button onClick={() => setModalOpen(true)}>Registrar Estado</Button>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>Error al cargar las estadísticas: {error.message}</p>
      ) : (
        <Table columns={columns} data={stats} />
      )}

      <div className="general-stats">
        <h4>Estadísticas Generales</h4>
        <p>Entregados: {generalStats.delivered_count}</p>
        <p>No Entregados: {generalStats.not_delivered_count}</p>
        <p>Porcentaje Entregados: {generalStats.percentage_delivered}%</p>
        <p>Porcentaje No Entregados: {generalStats.percentage_not_delivered}%</p>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Formik
          initialValues={{
            trimestre_id: '',
            period_id: '',
            course_id: '',
            teacher_id: '',
            state_id: '',
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <h1>Registrar progreso</h1>
              {isTrimestre ? (
                <TrimestreSelect
                  name="trimestre_id"
                  value={values.trimestre_id}
                  onChange={(e) => setFieldValue('trimestre_id', e.target.value)}
                  required={true}
                />
              ) : (
                <PeriodoSelect
                  name="period_id"
                  value={values.period_id}
                  onChange={(e) => setFieldValue('period_id', e.target.value)}
                  required={true}
                />
              )}
              <CourseSelect
                name="course_id"
                value={values.course_id}
                onChange={(e) => setFieldValue('course_id', e.target.value)}
                required={true}
              />
              <TeacherSelector
                name="teacher_id"
                value={values.teacher_id}
                onChange={(e) => setFieldValue('teacher_id', e.target.value)}
                required={true}
              />
              <StatusSelect
                name="state_id"
                value={values.state_id}
                onChange={(e) => setFieldValue('state_id', e.target.value)}
                required={true}
              />
              <Button type="submit">Registrar Estado</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator14;
