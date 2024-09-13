import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import Modal from '../../components/modal/Modal';
import './Indicator6.css';

const validationSchema = Yup.object({
  professor: Yup.string().required('Requerido'),
  course: Yup.string().required('Requerido'),
  parallel: Yup.string().required('Requerido'),
  percentage: Yup.number()
    .min(0, 'Debe ser al menos 0')
    .max(100, 'Debe ser 100 o menos')
    .required('Requerido')
});

const professorsData = [
  {
    id: 1,
    name: 'Juan Pérez',
    courses: [
      { name: 'Primero', parallels: {} },
      { name: 'Sexto', parallels: {} }
    ]
  },
  {
    id: 2,
    name: 'María González',
    courses: [
      { name: 'Cuarto', parallels: {} }
    ]
  },
];

const parallelsData = ['A', 'B', 'C', 'D'];
const periodsData = ['1', '2', '3', '4', '5', '6'];

const Indicator6 = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1'); // Start at the first period

  useEffect(() => {
    setProfessors(professorsData);
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    const newProgress = {
      professor: values.professor,
      course: values.course,
      parallel: values.parallel,
      period: selectedPeriod, // Use the selected period
      percentage: values.percentage
    };

    setProfessors(prevProfessors => {
      return prevProfessors.map(prof => {
        if (prof.name === values.professor) {
          const courseIndex = prof.courses.findIndex(c => c.name === values.course);
          if (courseIndex !== -1) {
            if (!prof.courses[courseIndex].parallels[values.parallel]) {
              prof.courses[courseIndex].parallels[values.parallel] = {};
            }
            prof.courses[courseIndex].parallels[values.parallel][selectedPeriod] = values.percentage;
          } else {
            prof.courses.push({
              name: values.course,
              parallels: {
                [values.parallel]: {
                  [selectedPeriod]: values.percentage
                }
              }
            });
          }
        }
        return prof;
      });
    });

    resetForm();
    setModalOpen(false);
  };

  const calculateCourseProgress = (course, period) => {
    const parallels = Object.values(course.parallels).map(parallel => parallel[period]);
    const filteredParallels = parallels.filter(Boolean);
    const total = filteredParallels.reduce((sum, percentage) => sum + Number(percentage), 0);
    return (total / 4).toFixed(2); // Divide by 4 to get the average
  };

  const calculateTotalProgress = (course) => {
    let totalSum = 0;
    let count = 0;
    
    periodsData.forEach(period => {
      const periodProgress = calculateCourseProgress(course, period);
      if (!isNaN(periodProgress)) {
        totalSum += parseFloat(periodProgress);
        count++;
      }
    });
    
    return count > 0 ? (totalSum / count).toFixed(2) : 0;
  };

  const handlePeriodChange = (direction) => {
    setSelectedPeriod(prev => {
      const newIndex = periodsData.indexOf(prev) + direction;
      if (newIndex >= 0 && newIndex < periodsData.length) {
        return periodsData[newIndex];
      }
      return prev;
    });
  };

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Progreso</button>
      <div className="period-navigation">
        <button onClick={() => handlePeriodChange(-1)} disabled={selectedPeriod === '1'}>&lt;</button>
        <span>Periodo {selectedPeriod}</span>
        <button onClick={() => handlePeriodChange(1)} disabled={selectedPeriod === '6'}>&gt;</button>
      </div>
      <div className="professor-table">
        <h3>Profesores Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>Profesor</th>
              <th>Curso</th>
              <th>Paralelo A</th>
              <th>Paralelo B</th>
              <th>Paralelo C</th>
              <th>Paralelo D</th>
              <th>Total avance en periodo {selectedPeriod}</th>
              <th>Total avance general</th>
            </tr>
          </thead>
          <tbody>
            {professors.flatMap((prof) =>
              prof.courses.map((course, courseIndex) => (
                <tr key={`${prof.id}-${courseIndex}`}>
                  {courseIndex === 0 && <td rowSpan={prof.courses.length}>{prof.name}</td>}
                  <td>{course.name}</td>
                  {parallelsData.map(parallel => (
                    <td key={parallel}>
                      {course.parallels[parallel]?.[selectedPeriod] || '-'}
                    </td>
                  ))}
                  <td>{calculateCourseProgress(course, selectedPeriod)}%</td>
                  <td>{calculateTotalProgress(course)}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Registrar Progreso</h2>
        <Formik
          initialValues={{
            professor: '',
            course: '',
            parallel: '',
            percentage: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="form">
              <Select
                label="Profesor"
                name="professor"
                required={true}
                onChange={(e) => {
                  setFieldValue('professor', e.target.value);
                  setSelectedProfessor(e.target.value);
                  setFieldValue('course', '');
                }}
              >
                <option value="">Seleccione un profesor</option>
                {professors.map((prof) => (
                  <option key={prof.id} value={prof.name}>
                    {prof.name}
                  </option>
                ))}
              </Select>

              {selectedProfessor && (
                <Select
                  label="Curso"
                  name="course"
                  required={true}
                  onChange={(e) => {
                    setFieldValue('course', e.target.value);
                    setSelectedCourse(e.target.value);
                  }}
                >
                  <option value="">Seleccione un curso</option>
                  {professors.find(prof => prof.name === selectedProfessor)?.courses.map((course) => (
                    <option key={course.name} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </Select>
              )}

              {selectedCourse && (
                <Select
                  label="Paralelo"
                  name="parallel"
                  required={true}
                >
                  <option value="">Seleccione un paralelo</option>
                  {parallelsData.map((parallel) => (
                    <option key={parallel} value={parallel}>
                      {parallel}
                    </option>
                  ))}
                </Select>
              )}

              <InputText
                label="Porcentaje de Progreso"
                placeholder="Ingrese el porcentaje"
                required={true}
                type="number"
                name="percentage"
              />

              <button type="submit">Agregar Progreso</button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default Indicator6;
