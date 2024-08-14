import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import Modal from '../../components/modal/Modal';
import './Indicator1.css';

const validationSchema = Yup.object({
  profesor: Yup.string()
    .max(30, 'Debe tener 30 caracteres o menos')
    .required('Requerido'),
  periodo: Yup.string()
    .oneOf(['Periodo 1', 'Periodo 2', 'Periodo 3'], 'Seleccione una opción válida')
    .required('Requerido'),
  estado: Yup.string()
    .oneOf(['Sí', 'Retraso', 'No', 'No corresponde'], 'Seleccione una opción válida')
    .required('Requerido'),
});

const Indicator8 = () => {
  const [reports, setReports] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  const handleSubmit = (values, { resetForm }) => {
    setReports([
      ...reports,
      {
        profesor: values.profesor,
        [values.periodo]: values.estado,
      },
    ]);
    resetForm();
    setModalOpen(false);
  };

  const calculateCounts = (periodo) => {
    const totalCount = reports.length;
    const deliveredCount = reports.filter(report => report[periodo] === 'Sí').length;
    const notDeliveredCount = totalCount - deliveredCount;
    const deliveredPercentage = totalCount ? ((deliveredCount / totalCount) * 100).toFixed(2) : 0;
    const notDeliveredPercentage = totalCount ? ((notDeliveredCount / totalCount) * 100).toFixed(2) : 0;

    return { totalCount, deliveredCount, notDeliveredCount, deliveredPercentage, notDeliveredPercentage };
  };

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Reporte</button>
      <div className="report-table">
        <h3>Reportes de Notas por Periodo</h3>
        <table>
          <thead>
            <tr>
              <th>Profesor</th>
              <th>Periodo 1</th>
              <th>Periodo 2</th>
              <th>Periodo 3</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td>{report.profesor}</td>
                {['Periodo 1', 'Periodo 2', 'Periodo 3'].map((periodo, idx) => (
                  <td key={idx} className={report[periodo] === 'Sí' ? 'delivered' : 'not-delivered'}>
                    {report[periodo] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="summary">
          {['Periodo 1', 'Periodo 2', 'Periodo 3'].map((periodo, idx) => {
            const { totalCount, deliveredCount, notDeliveredCount, deliveredPercentage, notDeliveredPercentage } = calculateCounts(periodo);
            return (
              <div key={idx} className="summary-period">
                <h4>{periodo}</h4>
                <p>Total Reportes: {totalCount}</p>
                <p>Reportados: {deliveredCount} ({deliveredPercentage}%)</p>
                <p>No Reportados: {notDeliveredCount} ({notDeliveredPercentage}%)</p>
              </div>
            );
          })}
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Registrar Reporte de Notas</h2>
        <Formik
          initialValues={{ profesor: '', periodo: '', estado: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="form">
              <Select label="Profesor" name="profesor" required={true}>
                <option value="">Seleccione</option>
                {/* Populate this with actual professor names */}
                <option value="Profesor A">Profesor A</option>
                <option value="Profesor B">Profesor B</option>
              </Select>
              <Select label="Periodo" name="periodo" required={true}>
                <option value="">Seleccione</option>
                <option value="Periodo 1">Periodo 1</option>
                <option value="Periodo 2">Periodo 2</option>
                <option value="Periodo 3">Periodo 3</option>
              </Select>
              <Select label="Estado" name="estado" required={true}>
                <option value="">Seleccione</option>
                <option value="Sí">Sí</option>
                <option value="Retraso">Retraso</option>
                <option value="No">No</option>
                <option value="No corresponde">No corresponde</option>
              </Select>
              <button type="submit">Agregar Reporte</button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator8;
