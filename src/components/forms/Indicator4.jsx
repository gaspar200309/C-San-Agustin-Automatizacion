import { useState, useEffect,  } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/modal/Modal';
import TeacherSelector from '../selected/TeacherSelector';
import StatusSelect from '../selected/StatusSelect';
import TrimestreSelect from '../selected/TrimestreSelect';
import { registerStatusIndicador4, getStatusIndicator4 } from '../../api/api'; // Asegúrate de tener esta función
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

  useEffect(() => {
    fetchEvaluations();
  }, [id]);

  const fetchEvaluations = async () => {
    try {
      const response = await getStatusIndicator4(id);
      setEvaluations(response.data.evaluations);
    } catch (error) {
      console.error('Error al obtener evaluaciones:', error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        indicator_id: 4, // ID fijo del indicador
        teacher_id: parseInt(values.teacher_id),
        trimestre_id: parseInt(values.trimestre_id),
        state_id: parseInt(values.state_id)
      };

      await registerStatusIndicador4(data);
      await fetchEvaluations(); // Recargar datos
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  }; 

  const columns = [
    {
      header: 'Profesor',
      accessor: 'teacher',
      render: (row) => `${row.teacher.name} ${row.teacher.last_name}`
    },
    {
      header: 'Asignatura',
      accessor: 'teacher.asignatura'
    },
    {
      header: 'Trimestre',
      accessor: 'trimester.name'
    },
    {
      header: 'Estado',
      accessor: 'state.name',
      render: (row) => {
        const stateClass = {
          'Sí': 'state-yes',
          'No': 'state-no',
          'Retraso': 'state-delay',
          'Incompleto': 'state-incomplete'
        }[row.state.name] || '';
        
        return (
          <span className={`state-badge ${stateClass}`}>
            {row.state.name}
          </span>
        );
      }
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Indicador 4: Cumplimiento de Publicaciones</h2>
        <Button 
          onClick={() => setModalOpen(true)}
        >
          Agregar Cumplimiento
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table 
          columns={columns} 
          data={evaluations}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Registrar Cumplimiento</h2>
          <Formik
            initialValues={{ 
              teacher_id: '', 
              trimestre_id: '', 
              state_id: '' 
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
                  required={true}
                />
                
                <TrimestreSelect
                  name="trimestre_id"
                  value={values.trimestre_id}
                  onChange={(e) => setFieldValue('trimestre_id', e.target.value)}
                  required={true}
                />

                <StatusSelect
                  name="state_id"
                  value={values.state_id}
                  onChange={(e) => setFieldValue('state_id', e.target.value)}
                  required={true}
                />

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Guardar
                  </Button>
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