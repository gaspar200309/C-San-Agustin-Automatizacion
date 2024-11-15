import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/modal/Modal';
import TrimestreSelect from '../selected/TrimestreSelect';
import { registerStudentStatus, getStudentStatus } from '../../api/api';
import Table from '../table/Table';
import { Button } from '../buttons/Button';
import InputText from '../inputs/InputText';

const validationSchema = Yup.object({
  trimestre_id: Yup.string().required('Requerido'),
  active_students: Yup.number().required('Requerido').positive().integer(),
});

const Indicator10 = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(statuses)
  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const response = await getStudentStatus();
      setStatuses(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        indicator_id: 10,
        trimestre_id: parseInt(values.trimestre_id),
        active_students: parseInt(values.active_students),
      };

      await registerStudentStatus(data);
      await fetchStatuses();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  // Definición de las columnas de la tabla
  const columns = [
    {
      header: 'Trimestre 1',
      columns: [
        { header: 'Activos', accessor: 'trimestre_1_active' },
        { header: 'Inactivos', accessor: 'trimestre_1_inactive' },
      ],
    },
    {
      header: 'Trimestre 2',
      columns: [
        { header: 'Activos', accessor: 'trimestre_2_active' },
        { header: 'Inactivos', accessor: 'trimestre_2_inactive' },
      ],
    },
    {
      header: 'Trimestre 3',
      columns: [
        { header: 'Activos', accessor: 'trimestre_3_active' },
        { header: 'Inactivos', accessor: 'trimestre_3_inactive' },
      ],
    },
    {
      header: 'Trimestre 4',
      columns: [
        { header: 'Activos', accessor: 'trimestre_4_active' },
        { header: 'Inactivos', accessor: 'trimestre_4_inactive' },
      ],
    },
  ];

  // Transformación de los datos para adaptarlos a la estructura de columnas
  const transformData = (data) => {
  return data.map((status) => ({
    trimestre_1_active: status.trimestre_id === 1 ? status.active_students : '-',
    trimestre_1_inactive: status.trimestre_id === 1 ? status.inactive_students : '-',
    trimestre_2_active: status.trimestre_id === 2 ? status.active_students : '-',
    trimestre_2_inactive: status.trimestre_id === 2 ? status.inactive_students : '-',
    trimestre_3_active: status.trimestre_id === 3 ? status.active_students : '-',
    trimestre_3_inactive: status.trimestre_id === 3 ? status.inactive_students : '-',
    trimestre_4_active: status.trimestre_id === 4 ? status.active_students : '-',
    trimestre_4_inactive: status.trimestre_id === 4 ? status.inactive_students : '-',
  }));
};

  return (
    <div className="indicator-container">
      <h2 className="text-2xl font-bold">Indicador 10: Nivel de cobertura de acceso al SIGA de parte de estudiantes.</h2>
      <Button onClick={() => setModalOpen(true)}>Agregar Estado</Button>

      <div>
        {loading ? (
          <p>Cargando datos...</p>
        ) : error ? (
          <p>Error al cargar los datos: {error.message}</p>
        ) : (
          <Table columns={columns} data={transformData(statuses)} />
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Registrar Estado de Estudiantes</h2>
          <Formik
            initialValues={{
              trimestre_id: '',
              active_students: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <TrimestreSelect
                  name="trimestre_id"
                  label = {'Trimestre'}
                  value={values.trimestre_id}
                  onChange={(e) => setFieldValue('trimestre_id', e.target.value)}
                  required
                />

                  <InputText
                    type="number"
                    label = {'Cantidad activos'}
                    id="active_students"
                    name="active_students"
                    value={values.active_students}
                    onChange={(e) => setFieldValue('active_students', e.target.value)}
                    required
                  />

                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default Indicator10;
