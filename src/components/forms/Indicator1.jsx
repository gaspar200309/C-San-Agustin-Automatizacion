import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import Modal from '../../components/modal/Modal';
import './Indicator1.css';

const validationSchema = Yup.object({
  documento: Yup.string()
    .max(15, 'Debe tener 15 caracteres o menos')
    .required('Requerido'),
  delivered: Yup.string()
    .oneOf(['true', 'false'], 'Seleccione una opción válida')
    .required('Requerido'),
});

const Indicator1 = () => {
  const [documents, setDocuments] = useState([
    { name: 'Primer documento subido', delivered: false },
    { name: 'Segundo documento entregado', delivered: true },
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedDocuments = localStorage.getItem('documents');
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const handleSubmit = (values, { resetForm }) => {
    setDocuments([...documents, { name: values.documento, delivered: values.delivered === 'true' }]);
    resetForm();
    setModalOpen(false);
  };

  const totalCount = documents.length;
  const deliveredCount = documents.filter(doc => doc.delivered).length;
  const notDeliveredCount = totalCount - deliveredCount;

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Documento</button>
      <div className="document-list">
        <h3>Documentos Subidos</h3>
        <ul>
          {documents.map((doc, index) => (
            <li key={index} className={`document ${doc.delivered ? 'delivered' : 'not-delivered'}`}>
              {doc.name} {doc.delivered ? '✔️' : '❌'}
            </li>
          ))}
        </ul>
        <p>Total: {totalCount}</p>
        <p>Entregados: {deliveredCount}</p>
        <p>No En
        
        tregados: {notDeliveredCount}</p>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Entrega de Documentos</h2>
        <Formik
          initialValues={{ documento: '', delivered: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="form">
              <InputText
                label="Documento"
                placeholder="Ingrese el nombre del documento"
                required={true}
                type="text"
                name="documento"
              />
              <Select label="Entregado" name="delivered" required={true}>
                <option value="">Seleccione</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </Select>
              <button type="submit">Agregar Documento</button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator1;
