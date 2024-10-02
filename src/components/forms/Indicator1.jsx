import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import StatusSelect from '../selected/StatusSelect';
import Modal from '../../components/modal/Modal';
import { getDocuments, registerDocuments, countDocuments } from '../../api/api';
import DocumentStats from '../graphics/DocumentStates';
import './Indicator1.css';

const validationSchema = Yup.object({
  documento: Yup.string()
    .max(50, 'Debe tener 15 caracteres o menos')
    .required('Requerido'),
  delivered: Yup.string()
    .oneOf(['Sí', 'No', 'Retraso', 'Incompleto', 'No corresponde'], 'Seleccione una opción válida')
    .required('Requerido'),
});

const Indicator1 = () => {
  const [documents, setDocuments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [counts, setCounts] = useState({ total: 0, delivered: 0, not_delivered: 0 });

  useEffect(() => {
    fetchDocuments();
    fetchCounts();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await getDocuments();
      console.log(response.data)
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await countDocuments();
      setCounts(response.data);
    } catch (error) {
      console.error('Error fetching document counts:', error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const transformedDelivered = ['Sí', 'Retraso', 'Incompleto'].includes(values.delivered);
    try {
      await registerDocuments({
        name: values.documento,
        delivered: transformedDelivered,
        indicator_id: 1 
      });
      resetForm();
      setModalOpen(false);
      fetchDocuments();
      fetchCounts();
    } catch (error) {
      console.error('Error registering document:', error);
    }
  };

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
        <p>Total: {counts.total}</p>
        <p>Entregados: {counts.delivered}</p>
        <p>No Entregados: {counts.not_delivered}</p>
      </div>
      <DocumentStats />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Entrega de Documentos</h2>
        <Formik
          initialValues={{ documento: '', delivered: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="form">
              <InputText
                label="Documento"
                placeholder="Ingrese el nombre del documento"
                required={true}
                type="text"
                name="documento"
              />
              <StatusSelect
                label="Estado"
                name="delivered"
                value={values.delivered}
                onChange={(e) => setFieldValue('delivered', e.target.value)}
              />
              <button type="submit">Agregar Documento</button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator1;