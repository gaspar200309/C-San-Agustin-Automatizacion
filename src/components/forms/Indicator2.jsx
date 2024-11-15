import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/modal/Modal';
import { getStatusIndicator, registerStatusIndicator } from '../../api/api';
import { Button } from '../buttons/Button';

const TeacherSelector = lazy(() => import('../selected/TeacherSelector'));
const StatusSelect = lazy(() => import('../../components/selected/StatusSelect'));
const Table = lazy(() => import('../table/Table'));

const validationSchema = Yup.object({
  profesor: Yup.string().required('Requerido'),
  estado: Yup.string().required('Requerido'),
});

const Indicator2 = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize columns to prevent unnecessary re-renders of the Table
  const columns = useMemo(() => [
    { header: 'Nombre', accessor: 'teacher', render: (row) => `${row.teacher.name} ${row.teacher.last_name}` },
    { header: 'Asignatura', accessor: 'teacher', render: (row) => row.teacher.asignatura },
    { header: 'Estado', accessor: 'state', render: (row) => row.state.name },
  ], []);

  // Fetch data from the API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStatusIndicator(2);
      setEvaluations(res.data.evaluations || []);
      setStatistics(res.data.statistics || {});
    } catch (err) {
      setError(err);
      console.error('Error al obtener las evaluaciones:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback(async (values) => {
    const data = {
      teacher_id: values.profesor,
      state_id: Number(values.estado),
      indicator_id: 2,
    };

    try {
      const response = await registerStatusIndicator(data);
      if (response.data && response.data.success) {
        setModalOpen(false);
        toast.success(response.data.message || 'Estado registrado con éxito.');
        await fetchData();
      } else {
        console.error('Error al registrar el estado:', response.data.error);
        toast.error(response.data?.error || 'Error al registrar el estado.');
      }
    } catch (error) {
      console.error('Error de red o servidor:', error);
      toast.error('No se pudo conectar con el servidor. Intente nuevamente.');
    }
  }, [fetchData]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="indicator-container">
      <Toaster />
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Profesor</button>
      
      <div className="professor-list">
        <h3>Entrega de Plan Curricular - Contenidos (PC-C).</h3>
        <Suspense fallback={<div>Cargando tabla...</div>}>
          <Table columns={columns} data={evaluations} onRowClick={(row) => console.log('Row clicked:', row)} />
        </Suspense>
        
        <div className="statistics">
          <h3>Estadísticas</h3>
          <p>Total: {statistics.total_count}</p>
          <p>Entregados: {statistics.delivered_count} ({statistics.delivered_percentage}%)</p>
          <p>No Entregados: {statistics.not_delivered_count} ({statistics.not_delivered_percentage}%)</p>
        </div>
      </div>

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h2>Agregar Profesor</h2>
          <Formik
            initialValues={{ profesor: '', estado: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="form">
                <Suspense fallback={<div>Cargando selector de profesor...</div>}>
                  <TeacherSelector
                    name="profesor"
                    value={values.profesor}
                    onChange={(e) => setFieldValue('profesor', e.target.value)}
                    required
                  />
                </Suspense>
                <Suspense fallback={<div>Cargando selector de estado...</div>}>
                  <StatusSelect
                    label="Estado"
                    name="estado"
                    value={values.estado}
                    onChange={(e) => setFieldValue('estado', e.target.value)}
                  />
                </Suspense>
                <Button type="submit">Registrar</Button>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </div>
  );
};

export default Indicator2;
