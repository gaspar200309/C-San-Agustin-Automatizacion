import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import Modal from '../../components/modal/Modal';
import './Indicator7.css';

const validationSchema = Yup.object({
  profesor: Yup.string().required('Requerido'),
  period: Yup.string().oneOf(['1', '2', '3', '4', '5', '6'], 'Seleccione una opción válida').required('Requerido'),
  status: Yup.string().oneOf(['Si', 'No', 'Retraso', 'No corresponde'], 'Seleccione una opción válida').required('Requerido'),
});

const initialProfessors = [
  { name: 'Dr. Juan Pérez', periods: { '1': 'Si', '2': 'No', '3': 'Retraso' } },
  { name: 'M.Sc. Ana López', periods: { '1': 'Si', '2': 'Si-Incompleto', '3': 'No' } },
  { name: 'Ing. Carlos García', periods: { '1': 'Retraso', '2': 'Si', '3': 'No corresponde' } },
  { name: 'PhD. María Rodríguez', periods: { '1': 'Si', '2': 'No', '3': 'Si-Retraso' } },
  { name: 'M.Sc. Luis González', periods: { '1': 'No', '2': 'Retraso', '3': 'Si-Incompleto' } },
];


const resolveConflict = (status1, status2) => {
  const conflictResolutionMap = {
    'Si-No': 'Si-Incompleto',
    'Si-Retraso': 'Si-Retraso',
    'No-Retraso': 'No-Retraso',
  };

  const key = `${status1}-${status2}`;
  return conflictResolutionMap[key] || conflictResolutionMap[`${status2}-${status1}`] || status1;
};

const Indicator7 = () => {
  const [professors, setProfessors] = useState(initialProfessors);
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
    const existingProfessor = professors.find(prof => prof.name === values.profesor);
    const currentPeriodStatus = existingProfessor?.periods[values.period];

    const resolvedStatus = currentPeriodStatus
      ? resolveConflict(currentPeriodStatus, values.status)
      : values.status;

    const updatedPeriods = {
      ...(existingProfessor?.periods || {}),
      [values.period]: resolvedStatus,
    };

    if (existingProfessor) {
      existingProfessor.periods = updatedPeriods;
      setProfessors([...professors]);
    } else {
      setProfessors([...professors, { name: values.profesor, periods: updatedPeriods }]);
    }

    resetForm();
    setModalOpen(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Si':
        return 'status-complete';
      case 'Incompleto':
      case 'Si-Incompleto':
        return 'status-incomplete';
      case 'No':
        return 'status-no';
      case 'Retraso':
      case 'Si-Retraso':
        return 'status-delayed';
      case 'No corresponde':
        return 'status-not-applicable';
      default:
        return '';
    }
  };

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Estado de Nota</button>
      <div className="professor-table">
        <h3>Profesores Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>Profesor</th>
              {['1', '2', '3', '4', '5', '6'].map((period, idx) => (
                <th key={idx}>Periodo {period}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {professors.map((prof, index) => (
              <tr key={index}>
                <td>{prof.name}</td>
                {['1', '2', '3', '4', '5', '6'].map((period, idx) => (
                  <td key={idx} className={getStatusClass(prof.periods[period])}>
                    {prof.periods[period] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Registrar Estado de Nota</h2>
        <Formik
          initialValues={{ profesor: '', period: '', status: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="form">
              <Select label="Profesor" name="profesor" required={true}>
                <option value="">Seleccione un profesor</option>
                {initialProfessors.map((prof, index) => (
                  <option key={index} value={prof.name}>{prof.name}</option>
                ))}
              </Select>

              <Select label="Periodo" name="period" required={true}>
                <option value="">Seleccione un periodo</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </Select>
              <Select label="Estado" name="status" required={true}>
                <option value="">Seleccione un estado</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
                <option value="Retraso">Retraso</option>
                <option value="No corresponde">No corresponde</option>
              </Select>
              <button type="submit">Agregar Estado</button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator7;
