import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Formik, Form } from 'formik';
import { registerIndicator15, getIndicator15Stats } from '../../api/api';
import CourseSelect from '../selected/CourseSelect';
import TrimestreSelect from '../selected/TrimestreSelect';
import TeacherSelector from '../selected/TeacherSelector';
import Table from '../table/Table';
import { Button } from '../buttons/Button';
import Modal from '../modal/Modal';
import UserSelect from '../selected/UserSelect';
import InputText from '../inputs/InputText';

// Custom hook for fetching and processing data
const useIndicator15Data = (isUser) => {
  const [stats, setStats] = useState([]);
  const [generalStats, setGeneralStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getIndicator15Stats();
      const filteredStatistics = response.data.statistics.filter((record) =>
        isUser ? record.user_name : record.teacher_name
      );

      const groupedData = filteredStatistics.reduce((acc, record) => {
        const key = `${record.course_id}-${isUser ? record.user_name : record.teacher_name}`;
        if (!acc[key]) {
          acc[key] = {
            course_id: record.course_id,
            course_name: record.course_name,
            teacher_name: isUser ? null : record.teacher_name,
            user_name: isUser ? record.user_name : null,
            trimestre1: '-',
            trimestre2: '-',
            trimestre3: '-',
            trimestre4: '-',
          };
        }
        if (record.trimestre_id) {
          acc[key][`trimestre${record.trimestre_id}`] = record.total_communications;
        }
        return acc;
      }, {});
      
      setStats(Object.values(groupedData));
      setGeneralStats(response.data.general);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [isUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, generalStats, loading, error, fetchData };
};

const Indicator15 = () => {
  const [isUser, setIsUser] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { stats, generalStats, loading, error, fetchData } = useIndicator15Data(isUser);

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        indicator_id: 15,
        course_id: parseInt(values.course_id),
        ...(isUser ? { user_id: parseInt(values.user_id) } : { teacher_id: parseInt(values.teacher_id) }),
        trimestre_id: parseInt(values.trimestre_id),
        communication: parseInt(values.communication),
      };

      await registerIndicator15(data);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  // Column definitions memoized
  const columns = useMemo(
    () => [
      { header: 'Curso', accessor: 'course_name' },
      { header: isUser ? 'Usuario' : 'Profesor', accessor: isUser ? 'user_name' : 'teacher_name' },
      { header: 'Trimestre 1', accessor: 'trimestre1' },
      { header: 'Trimestre 2', accessor: 'trimestre2' },
      { header: 'Trimestre 3', accessor: 'trimestre3' },
      { header: 'Trimestre 4', accessor: 'trimestre4' },
    ],
    [isUser]
  );

  return (
    <div className="indicator-container">
      <h3>Estadísticas del Indicador 15</h3>

      {/* Toggle between User and Teacher */}
      <label>
        <input
          type="checkbox"
          checked={isUser}
          onChange={() => setIsUser((prev) => !prev)}
        />
        Modo {isUser ? 'Usuario' : 'Profesor'}
      </label>

      <Button onClick={() => setModalOpen(true)}>Registrar Comunicación</Button>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>Error al cargar las estadísticas: {error.message}</p>
      ) : (
        <Table columns={columns} data={stats} />
      )}

      <div className="general-stats">
        <h4>Estadísticas Generales</h4>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Formik
          initialValues={{
            trimestre_id: '',
            course_id: '',
            teacher_id: '',
            user_id: '',
            communication: '',
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <h1>Registrar Comunicación</h1>
              <TrimestreSelect
                name="trimestre_id"
                value={values.trimestre_id}
                onChange={(e) => setFieldValue('trimestre_id', e.target.value)}
                required
              />
              <CourseSelect
                name="course_id"
                value={values.course_id}
                onChange={(e) => setFieldValue('course_id', e.target.value)}
                required
              />
              {isUser ? (
                <UserSelect
                  name="user_id"
                  value={values.user_id}
                  onChange={(e) => setFieldValue('user_id', e.target.value)}
                  required
                />
              ) : (
                <TeacherSelector
                  name="teacher_id"
                  value={values.teacher_id}
                  onChange={(e) => setFieldValue('teacher_id', e.target.value)}
                  required
                />
              )}
              <InputText
                id="communication"
                name="communication"
                label="Cantidad de Comunicaciones"
                type="number"
                value={values.communication}
                onChange={(e) => setFieldValue('communication', e.target.value)}
                required
              />
              <Button type="submit">Registrar Comunicación</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator15;
