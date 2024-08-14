import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import Modal from '../../components/modal/Modal';
import './Indicator1.css';

const validationSchema = Yup.object({
  profesor: Yup.string()
    .max(30, 'Debe tener 30 caracteres o menos')
    .required('Requerido'),
  coordinator: Yup.string()
    .oneOf(['Coordinator 1', 'Coordinator 2'], 'Seleccione una opción válida')
    .required('Requerido'),
  delivered: Yup.string()
    .oneOf(['true', 'false'], 'Seleccione una opción válida')
    .required('Requerido'),
});

const Indicator3 = () => {
  const [professors, setProfessors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [coordinators, setCoordinators] = useState(['Coordinator 1', 'Coordinator 2']); // Default coordinators

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
    const existingProfessor = professors.find(prof => prof.name === values.profesor);
    const updatedCompliance = {
      ...(existingProfessor?.compliance || {}),
      [values.coordinator]: values.delivered === 'true',
    };

    if (existingProfessor) {
      existingProfessor.compliance = updatedCompliance;
      setProfessors([...professors]);
    } else {
      setProfessors([...professors, { name: values.profesor, compliance: updatedCompliance }]);
    }
    resetForm();
    setModalOpen(false);
  };

  const totalCount = professors.length;
  const deliveredCount = professors.reduce((acc, prof) => {
    return acc + Object.values(prof.compliance).filter(delivered => delivered).length;
  }, 0);
  const notDeliveredCount = professors.reduce((acc, prof) => {
    return acc + Object.values(prof.compliance).filter(delivered => !delivered).length;
  }, 0);
  const totalComplianceCount = deliveredCount + notDeliveredCount;
  const deliveredPercentage = totalComplianceCount ? ((deliveredCount / totalComplianceCount) * 100).toFixed(2) : 0;
  const notDeliveredPercentage = totalComplianceCount ? ((notDeliveredCount / totalComplianceCount) * 100).toFixed(2) : 0;

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Cumplimiento</button>
      <div className="professor-table">
        <h3>Profesores Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>Profesor</th>
              {coordinators.map((coordinator, idx) => (
                <th key={idx}>{coordinator}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {professors.map((prof, index) => (
              <tr key={index}>
                <td>{prof.name}</td>
                {coordinators.map((coordinator, idx) => (
                  <td key={idx} className={prof.compliance[coordinator] ? 'delivered' : 'not-delivered'}>
                    {prof.compliance[coordinator] ? '✔️' : '❌'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p>Total Profesores: {totalCount}</p>
        <p>Total Cumplimientos: {totalComplianceCount}</p>
        <p>Entregados: {deliveredCount} ({deliveredPercentage}%)</p>
        <p>No Entregados: {notDeliveredCount} ({notDeliveredPercentage}%)</p>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Registrar Cumplimiento</h2>
        <Formik
          initialValues={{ profesor: '', coordinator: '', delivered: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="form">
              <InputText
                label="Profesor"
                placeholder="Ingrese el nombre del profesor"
                required={true}
                type="text"
                name="profesor"
              />
              <Select label="Coordinador" name="coordinator" required={true}>
                <option value="">Seleccione</option>
                <option value="Coordinator 1">Coordinator 1</option>
                <option value="Coordinator 2">Coordinator 2</option>
              </Select>
              <Select label="Entregado" name="delivered" required={true}>
                <option value="">Seleccione</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </Select>
              <button type="submit">Agregar Cumplimiento</button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator3;
