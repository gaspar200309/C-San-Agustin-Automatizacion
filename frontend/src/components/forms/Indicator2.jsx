import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Select from '../../components/selected/Select';
import Modal from '../../components/modal/Modal';
import './Indicator1.css';

const validationSchema = Yup.object({
  profesor: Yup.string().required('Requerido'),
  estado: Yup.string()
    .oneOf(['Sí', 'No', 'Retraso', 'Incompleto', 'No corresponde'], 'Seleccione una opción válida')
    .required('Requerido'),
});

const Indicator2 = () => {
  const [professors, setProfessors] = useState([
    { name: 'Michael Jacinto Gonzales', status: 'Retraso' },
    { name: 'Susana Corrales Vargas', status: 'Sí' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedProfessors = localStorage.getItem('professors');
    if (storedProfessors) {
      setProfessors(JSON.parse(storedProfessors));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('professors', JSON.stringify(professors));
  }, [professors]);

  const handleSubmit = (values, { resetForm }) => {
    setProfessors([...professors, { name: values.profesor, status: values.estado }]);
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
                <td>{prof.name}</td>
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
              <Select
                label="Profesor"
                name="profesor"
                required={true}
                value={values.profesor}
                onChange={(e) => setFieldValue('profesor', e.target.value)}
              >
                <option value="">Seleccione Profesor</option>
                <option value="Michael Jacinto Gonzales">Michael Jacinto Gonzales</option>
                <option value="Susana Corrales Vargas">Susana Corrales Vargas</option>
                {/* Add more professors here */}
              </Select>
              <Select
                label="Estado"
                name="estado"
                required={true}
                value={values.estado}
                onChange={(e) => setFieldValue('estado', e.target.value)}
              >
                <option value="">Seleccione Estado</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
                <option value="Retraso">Retraso</option>
                <option value="Incompleto">Incompleto</option>
                <option value="No corresponde">No corresponde</option>
              </Select>
              <button type="submit">Agregar Profesor</button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator2;
