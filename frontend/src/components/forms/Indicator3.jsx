import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import StatusSelect from '../../components/selected/StatusSelect';
import TeacherSelector from '../selected/TeacherSelector';
import Modal from '../../components/modal/Modal';
import { Button } from '../buttons/Button';
import Table from '../table/Table'
import { getTeacher } from '../../api/api';
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
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [coordinators, setCoordinators] = useState(['Coordinator 1', 'Coordinator 2']); 

  useEffect(() => {
    getTeacher().then(response => {
      setProfessors(response.data);
      setTeacherOptions(response.data.map(teacher => ({
        value: `${teacher.name} ${teacher.last_name}`,
        label: `${teacher.name} ${teacher.last_name}`,
      })));
    });
  }, []);

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

  const columns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellido', accessor: 'last_name' },
    { 
      header: 'Nombre Completo', 
      accessor: 'fullName',
      render: (row) => `${row.name} ${row.last_name}`
    },
    { 
      header: 'Coordinador 1', 
      accessor: 'coordinator1',
      render: (row) => row.compliance?.coordinator1 ? '✔️' : '❌'
    },
    { 
      header: 'Coordinador 2', 
      accessor: 'coordinator2',
      render: (row) => row.compliance?.coordinator2 ? '✔️' : '❌'
    },
  ];

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };
  

  const totalCount = professors.length;
  const deliveredCount = professors.reduce((acc, prof) => {
    return acc + Object.values(prof.compliance || {}).filter(delivered => delivered).length;
  }, 0);
  const notDeliveredCount = professors.reduce((acc, prof) => {
    return acc + Object.values(prof.compliance || {}).filter(delivered => !delivered).length;
  }, 0);
  const totalComplianceCount = deliveredCount + notDeliveredCount;
  const deliveredPercentage = totalComplianceCount ? ((deliveredCount / totalComplianceCount) * 100).toFixed(2) : 0;
  const notDeliveredPercentage = totalComplianceCount ? ((notDeliveredCount / totalComplianceCount) * 100).toFixed(2) : 0;

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Cumplimiento</button>
      <div className="professor-table">
        <h3>Tasa de cumplimiento en la entrega de Plan Global Operativo (PGO) bajo los lineamientos definidos.</h3>
        <Table 
        columns={columns} 
        data={professors} 
        onRowClick={handleRowClick}
        />
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
              <Button type="primary" onClick={handleSubmit}>Registrar</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator3;
