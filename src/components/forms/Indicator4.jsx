import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/modal/Modal';
import TeacherSelector from '../selected/TeacherSelector';
import StatusSelect from '../selected/StatusSelect';
import TrimestreSelect from '../selected/TrimestreSelect';
import { registerStatusIndicador4, getStatusIndicator4 } from '../../api/api';
import Table from '../table/Table';
import { Button } from '../buttons/Button';
import './Indicator4.css';

const validationSchema = Yup.object({
  teacher_id: Yup.string().required('Requerido'),
  trimestre_id: Yup.string().required('Requerido'),
  state_id: Yup.string().required('Requerido'),
});

const Indicator4 = () => {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvaluations();
  }, [id]);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const response = await getStatusIndicator4(id);
      const transformedData = response.data.evaluations.reduce((acc, evaluation) => {
        const existing = acc.find(
          (item) =>
            item.profesor === `${evaluation.teacher.name} ${evaluation.teacher.last_name}` &&
            item.asignatura === evaluation.teacher.asignatura
        );
        if (existing) {
          existing[`trimestre${evaluation.trimester.id}`] = evaluation.state.name;
        } else {
          acc.push({
            profesor: `${evaluation.teacher.name} ${evaluation.teacher.last_name}`,
            asignatura: evaluation.teacher.asignatura,
            trimestre1: evaluation.trimester.name === 'Primer Trimestre' ? evaluation.state.name : '',
            trimestre2: evaluation.trimester.name === 'Segundo Trimestre' ? evaluation.state.name : '',
            trimestre3: evaluation.trimester.name === 'Tercer Trimestre' ? evaluation.state.name : '',
          });
        }
        return acc;
      }, []);
      setEvaluations(transformedData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        indicator_id: 4,
        teacher_id: parseInt(values.teacher_id),
        trimestre_id: parseInt(values.trimestre_id),
        state_id: parseInt(values.state_id),
      };

      await registerStatusIndicador4(data);
      await fetchEvaluations();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  const columns = [
    { header: 'Profesor', accessor: 'profesor' },
    { header: 'Asignatura', accessor: 'asignatura' },
    { header: 'Trimestre 1', accessor: 'trimestre1' },
    { header: 'Trimestre 2', accessor: 'trimestre2' },
    { header: 'Trimestre 3', accessor: 'trimestre3' },
  ];

  return (
    <div className="indicator-container">
      <div className="">
        <h2 className="text-2xl font-bold">Indicador 4: Cumplimiento de Publicaciones</h2>
        <Button onClick={() => setModalOpen(true)}>Agregar Cumplimiento</Button>
      </div>

      <div className="">
        {loading ? (
          <p>Cargando datos...</p>
        ) : error ? (
          <p>Error al cargar los datos: {error.message}</p>
        ) : (
          <Table columns={columns} data={evaluations} />
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Registrar Cumplimiento</h2>
          <Formik
            initialValues={{
              teacher_id: '',
              trimestre_id: '',
              state_id: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-4">
                <TeacherSelector
                  name="teacher_id"
                  value={values.teacher_id}
                  onChange={(e) => setFieldValue('teacher_id', e.target.value)}
                  required
                />

                <TrimestreSelect
                  name="trimestre_id"
                  value={values.trimestre_id}
                  onChange={(e) => setFieldValue('trimestre_id', e.target.value)}
                  required
                />

                <StatusSelect
                  name="state_id"
                  value={values.state_id}
                  onChange={(e) => setFieldValue('state_id', e.target.value)}
                  required
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default Indicator4;
