import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Modal from '../modal/Modal';
import Select from '../selected/Select';
import InputText from '../inputs/InputText';
import TeacherSelector from '../selected/TeacherSelector';
import CourseSelect from '../selected/CourseSelect';
import Table from '../table/Table'; 
import { Button } from '../buttons/Button';

import { registerStatusIndicador6, getStatusIndicator6 } from '../../api/api';

const Indicator6 = () => {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Mayo-Junio 2024');
  const [selectedPeriodId, setSelectedPeriodId] = useState(2); 
  const [evaluations, setEvaluations] = useState([]);
  
  // Periodos con sus respectivos IDs
  const periods = [
    { name: "Enero-Febrero 2024", id: 1 },
    { name: "Mayo-Junio 2024", id: 2 },
    { name: "Marzo-Abril 2024", id: 3 },
    { name: "Mayo-Junio 2024", id: 4 },
    { name: "Mayo-Junio 2024", id: 5 },
    { name: "Mayo-Junio 2024", id: 6 },
  ]; 

  const handlePeriodChange = (direction) => {
    const currentIndex = periods.findIndex(period => period.name === selectedPeriod);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < periods.length) {
      setSelectedPeriod(periods[newIndex].name);
      setSelectedPeriodId(periods[newIndex].id); // Actualizar el ID del periodo
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, [id]);

  const fetchEvaluations = async () => {
    try {
      const response = await getStatusIndicator6(id);
      setEvaluations(response.data);
    } catch (error) {
      console.error('Error al obtener evaluaciones:', error);
    }
  };
  
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        teacher_id: parseInt(values.teacher_id),
        course_id: parseInt(values.course_id),
        period_id: selectedPeriodId, // Usar el ID del periodo seleccionado
        parallel: values.parallel,
        percentage: parseInt(values.percentage),
      };

      await registerStatusIndicador6(data);
      await fetchEvaluations(); 
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  const tableData = evaluations.flatMap(evaluation => {
    return Object.entries(evaluation.courses).map(([courseName, courseData]) => ({
      professor: evaluation.teacher_name.trim(), // Eliminar espacios extra
      course: courseName,
      parallelA: courseData.paralelos['A']?.[selectedPeriod] || '-',
      parallelB: courseData.paralelos['B']?.[selectedPeriod] || '-',
      parallelC: courseData.paralelos['C']?.[selectedPeriod] || '-',
      parallelD: courseData.paralelos['D']?.[selectedPeriod] || '-',
      periodProgress: courseData.promedio_periodo[selectedPeriod] || '-',
      totalProgress: courseData.promedio_total,
    }));
  });
  
  const columns = [
    { header: 'Profesor', accessor: 'professor' },
    { header: 'Curso', accessor: 'course' },
    { header: 'Paralelo A', accessor: 'parallelA' },
    { header: 'Paralelo B', accessor: 'parallelB' },
    { header: 'Paralelo C', accessor: 'parallelC' },
    { header: 'Paralelo D', accessor: 'parallelD' },
    { header: `Total avance en periodo ${selectedPeriod}`, accessor: 'periodProgress' },
    { header: 'Total avance general', accessor: 'totalProgress' },
  ];

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Progreso</button>
      <div className="period-navigation">
        <button onClick={() => handlePeriodChange(-1)} disabled={selectedPeriod === periods[0].name}>&lt;</button>
        <span>Periodo: {selectedPeriod}</span>
        <button onClick={() => handlePeriodChange(1)} disabled={selectedPeriod === periods[periods.length - 1].name}>&gt;</button>
      </div>
      <div className="professor-table">
        <h3>Profesores Registrados</h3>
        <Table columns={columns} data={tableData} />
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Registrar Progreso</h2>
        <Formik
          initialValues={{
            teacher_id: '',
            course_id: '',
            parallel: '',
            percentage: '',
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="form">
              <TeacherSelector
                name="teacher_id"
                value={values.teacher_id}
                onChange={(e) => setFieldValue('teacher_id', e.target.value)}
                required={true}
              />
              <CourseSelect
                label="Curso"
                name="course_id"
                required={true}
                onChange={(e) => setFieldValue('course_id', e.target.value)}
                value={values.course_id}
              />
              <Select
                label="Paralelo"
                name="parallel"
                required={true}
              >
                <option value="">Seleccione un paralelo</option>
                {['A', 'B', 'C', 'D'].map((parallel) => (
                  <option key={parallel} value={parallel}>
                    {parallel}
                  </option>
                ))}
              </Select>
              <InputText
                label="Porcentaje de Progreso"
                placeholder="Ingrese el porcentaje"
                required={true}
                type="number"
                name="percentage"
              />
              <Button type="submit">Agregar Progreso</Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator6;
