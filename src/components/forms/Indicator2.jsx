import { Toaster, toast } from 'sonner'; 
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/modal/Modal';
import TeacherSelector from '../selected/TeacherSelector';
import StatusSelect from '../../components/selected/StatusSelect';
import { getStatusIndicator, registerStatusIndicator } from '../../api/api';
import Table from '../table/Table';
import { Button } from '../buttons/Button';

const validationSchema = Yup.object({
  profesor: Yup.string().required('Requerido'),
  estado: Yup.string().required('Requerido'),
});

const Indicator2 = () => {
  const { id } = useParams(); 
  const [modalOpen, setModalOpen] = useState(false);
  const [evaluations, setEvaluations] = useState([]); 
  const [statistics, setStatistics] = useState({}); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const res = await getStatusIndicator(id);
        setEvaluations(res.data.evaluations || []);
        setStatistics(res.data.statistics || {});
      } catch (err) {
        setError(err);
        console.error('Error al obtener las evaluaciones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSubmit = async (values) => {
    const payload = {
      teacher_id: values.profesor,
      state_id: Number(values.estado),
      indicator_id: Number(id),
    };

    const response = await registerStatusIndicator(payload);
    if (response.success) {
      setModalOpen(false);
      toast.success('Estado registrado con éxito.');
      const data = await getStatusIndicator(id);
      setEvaluations(data.evaluations || []);
      setStatistics(data.statistics || {});
    } else {
      console.error('Error al registrar el estado:', response.error);
      toast.error('Error al registrar el estado.'); 
    }
  };

  const columns = [
    { header: 'Nombre', accessor: 'teacher', render: (row) => `${row.teacher.name} ${row.teacher.last_name}` },
    { header: 'Asignatura', accessor: 'teacher', render: (row) => row.teacher.asignatura },
    { header: 'Estado', accessor: 'state', render: (row) => row.state.name },
  ];

  return (
    <div className="indicator-container">
      <Toaster />
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Profesor</button>
      
      <div className="professor-list">
        <h3>Entrega de Plan Curricular - Contenidos (PC-C).</h3>
        <Table columns={columns} data={evaluations} onRowClick={(row) => console.log('Row clicked:', row)} />
        
        <div className="statistics">
          <h3>Estadísticas</h3>
          <p>Total: {statistics.total_count}</p>
          <p>Entregados: {statistics.delivered_count} ({statistics.delivered_percentage}%)</p>
          <p>No Entregados: {statistics.not_delivered_count} ({statistics.not_delivered_percentage}%)</p>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Agregar Profesor</h2>
        <Formik
          initialValues={{ profesor: '', estado: '' }}
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
              <StatusSelect
                label="Estado"
                name="estado"
                value={values.estado}
                onChange={(e) => setFieldValue('estado', e.target.value)}
              />
              <Button type="submit">Registrar</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator2;
