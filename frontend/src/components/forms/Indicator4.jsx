import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getTeacher } from '../../api/api';
import Select from '../../components/selected/Select';
import Modal from '../../components/modal/Modal';
import './Indicator4.css';

const validationSchema = Yup.object({
  profesor: Yup.string()
    .required('Requerido'),
  trimester: Yup.string()
    .oneOf(['Trimester 1', 'Trimester 2', 'Trimester 3'], 'Seleccione una opción válida')
    .required('Requerido'),
  status: Yup.string()
    .oneOf(['Sí', 'No', 'Retraso', 'No corresponde'], 'Seleccione una opción válida')
    .required('Requerido'),
});

const Indicator4 = () => {
  const [professors, setProfessors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getTeacher().then(response => {
      setProfessors(response.data);
      setTeacherOptions(response.data.map(teacher => ({
        value: `${teacher.name} ${teacher.last_name}`,
        label: `${teacher.name} ${teacher.last_name}`,
      })));
    });
  }, []);

  useEffect(() => {
    const storedProfessors = localStorage.getItem('professorsTrimester');
    if (storedProfessors) {
      setProfessors(JSON.parse(storedProfessors));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('professorsTrimester', JSON.stringify(professors));
  }, [professors]);

  const handleSubmit = (values, { resetForm }) => {
    const existingProfessor = professors.find(prof => prof.name === values.profesor);
    const updatedCompliance = {
      ...(existingProfessor?.compliance || {}),
      [values.trimester]: values.status,
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

  const isDelivered = (status) => ['Sí', 'Sí-Incompleto', 'Sí-Retraso'].includes(status);

  const calculateCounts = (trimester) => {
    const totalCount = professors.length;
    const deliveredCount = professors.reduce((acc, prof) => {
      return acc + (isDelivered(prof.compliance[trimester]) ? 1 : 0);
    }, 0);
    const notDeliveredCount = totalCount - deliveredCount;
    const deliveredPercentage = totalCount ? ((deliveredCount / totalCount) * 100).toFixed(2) : 0;
    const notDeliveredPercentage = totalCount ? ((notDeliveredCount / totalCount) * 100).toFixed(2) : 0;

    return { totalCount, deliveredCount, notDeliveredCount, deliveredPercentage, notDeliveredPercentage };
  };

  const calculateOverallCounts = () => {
    const trimesters = ['Trimester 1', 'Trimester 2', 'Trimester 3'];
    const overallDeliveredCount = professors.reduce((acc, prof) => {
      return acc + trimesters.reduce((accTrimester, trimester) => {
        return accTrimester + (isDelivered(prof.compliance[trimester]) ? 1 : 0);
      }, 0);
    }, 0);
    const overallTotalCount = professors.length * trimesters.length;
    const overallNotDeliveredCount = overallTotalCount - overallDeliveredCount;
    const overallDeliveredPercentage = overallTotalCount ? ((overallDeliveredCount / overallTotalCount) * 100).toFixed(2) : 0;
    const overallNotDeliveredPercentage = overallTotalCount ? ((overallNotDeliveredCount / overallTotalCount) * 100).toFixed(2) : 0;

    return { overallTotalCount, overallDeliveredCount, overallNotDeliveredCount, overallDeliveredPercentage, overallNotDeliveredPercentage };
  };

  const { overallTotalCount, overallDeliveredCount, overallNotDeliveredCount, overallDeliveredPercentage, overallNotDeliveredPercentage } = calculateOverallCounts();

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Cumplimiento</button>
      <div className="professor-table">
        <h3>Profesores Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>Profesor</th>
              <th>Trimester 1</th>
              <th>Trimester 2</th>
              <th>Trimester 3</th>
            </tr>
          </thead>
          <tbody>
            {professors.map((prof, index) => (
              <tr key={index}>
                <td>{prof.name}</td>
                {['Trimester 1', 'Trimester 2', 'Trimester 3'].map((trimester, idx) => (
                  <td key={idx} className={isDelivered(prof.compliance[trimester]) ? 'delivered' : 'not-delivered'}>
                    {prof.compliance[trimester] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='result'>
        {['Trimester 1', 'Trimester 2', 'Trimester 3'].map((trimester, idx) => {
          const { totalCount, deliveredCount, notDeliveredCount, deliveredPercentage, notDeliveredPercentage } = calculateCounts(trimester);
          return (
            <div key={idx} className="summary">
              <h4>{trimester}</h4>
              <p>Total Profesores: {totalCount}</p>
              <p>Entregados: {deliveredCount} ({deliveredPercentage}%)</p>
              <p>No Entregados: {notDeliveredCount} ({notDeliveredPercentage}%)</p>
            </div>
          );
        })}
        </div>
        <div className="summary">
          <h4>Overall Compliance</h4>
          <p>Total Evaluations: {overallTotalCount}</p>
          <p>Entregados: {overallDeliveredCount} ({overallDeliveredPercentage}%)</p>
          <p>No Entregados: {overallNotDeliveredCount} ({overallNotDeliveredPercentage}%)</p>
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Registrar Cumplimiento</h2>
        <Formik
          initialValues={{ profesor: '', trimester: '', status: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="form">
              <Select label="Profesor" name="profesor" required={true}>
                <option value="">Seleccione</option>
                {professorOptions.map(prof => (
                  <option key={prof.value} value={prof.value}>{prof.label}</option>
                ))}
              </Select>
              <Select label="Trimestre" name="trimester" required={true}>
                <option value="">Seleccione</option>
                <option value="Trimester 1">Trimester 1</option>
                <option value="Trimester 2">Trimester 2</option>
                <option value="Trimester 3">Trimester 3</option>
              </Select>
              <Select label="Estado" name="status" required={true}>
                <option value="">Seleccione</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
                <option value="Retraso">Retraso</option>
                <option value="No corresponde">No corresponde</option>
              </Select>
              <button type="submit">Agregar Cumplimiento</button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator4;
