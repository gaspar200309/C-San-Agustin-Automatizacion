import { useState} from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/modal/Modal';
import TeacherSelector from '../selected/TeacherSelector';
import StatusSelect from '../../components/selected/StatusSelect';
import './Indicator1.css';
import { Button } from '../buttons/Button';

const validationSchema = Yup.object({
  profesor: Yup.string().required('Requerido'),
  estado: Yup.string()
    .oneOf(['Sí', 'No', 'Retraso', 'Incompleto', 'No corresponde'], 'Seleccione una opción válida')
    .required('Requerido'),
});

const Indicator2 = () => {
  const [professors, setProfessors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);


  const handleSubmit = (values, { resetForm }) => {
    const newProfessor = {
      name: values.profesor.split(' ')[0],
      last_name: values.profesor.split(' ').slice(1).join(' '),
      status: values.estado
    };
    setProfessors(prevProfessors => [...prevProfessors, newProfessor]);
    resetForm();
    setModalOpen(false);
  };

  const totalCount = professors.length;
  const deliveredCount = professors.filter(prof => ['Sí', 'Retraso', 'Incompleto'].includes(prof.status)).length;
  const notDeliveredCount = totalCount - deliveredCount;
  const deliveredPercentage = ((deliveredCount / totalCount) * 100).toFixed(2);
  const notDeliveredPercentage = ((notDeliveredCount / totalCount) * 100).toFixed(2);

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Profesor</button>
      <div className="professor-list">
        <h3>Entrega de Plan Curricular - Contenidos (PC-C).</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {professors.map((prof, index) => (
              <tr key={index} className={['Sí', 'Retraso', 'Incompleto'].includes(prof.status) ? 'delivered' : 'not-delivered'}>
                <td>{`${prof.name} ${prof.last_name}`}</td>
                <td>{prof.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total: {totalCount}</p>
        <p>Entregados: {deliveredCount} ({deliveredPercentage}%)</p>
        <p>No Entregados: {notDeliveredCount} ({notDeliveredPercentage}%)</p>
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
              <Button type='secundary' onClick={handleSubmit}>Registrar </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator2;
