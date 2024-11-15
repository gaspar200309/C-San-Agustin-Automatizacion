import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Modal from "../modal/Modal";
import InputText from "../inputs/InputText";
import TeacherSelector from "../selected/TeacherSelector";
import PeriodoSelect from "../selected/PeriodoSelect";
import Table from "../table/Table";
import { Button } from "../buttons/Button";
import { registerStatusIndicador6, getStatusIndicator6 } from "../../api/api";
import CourseSelectByTeacher from "../selected/CourseSelectByT";

const Indicator6 = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    fetchEvaluations();
  }, []);


  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value); // Update selected period
  };

  const fetchEvaluations = async () => {
    try {
      const response = await getStatusIndicator6(6);
      processEvaluations(response.data);
    } catch (error) {
      console.error("Error al obtener evaluaciones:", error);
    }
  };

  const processEvaluations = (data) => {
    const periodKeys = [
      "Enero 2025",
      "Febrero 2025",
      "Marzo 2025",
      "Abril 2025",
      "Mayo 2025",
      "Junio 2025",
      "Julio 2025",
    ];

    const rows = data
      .map((teacher) => {
        return Object.keys(teacher.courses).map((courseName) => {
          const course = teacher.courses[courseName];
          const periods = course.periods;

          // Crea un objeto para cada fila, donde los periodos se asignan dinámicamente
          const rowData = {
            professor: teacher.teacher_name,
            course: courseName,
            periodProgress: course.average || 0,
          };

          // Agrega cada periodo a la fila en el orden correcto basado en periodKeys
          periodKeys.forEach((periodKey, index) => {
            rowData[`periodo${index + 1}`] = periods[periodKey] || 0;
          });

          return rowData;
        });
      })
      .flat();

    setProcessedData(rows);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        teacher_id: parseInt(values.teacher_id),
        course_id: parseInt(values.course_id),
        period_id: parseInt(values.period),
        percentage: parseInt(values.percentage),
      };

      await registerStatusIndicador6(data);
      await fetchEvaluations();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  const columns = [
    { header: "Profesor", accessor: "professor" },
    { header: "Curso", accessor: "course" },
    { header: "Periodo 1", accessor: "periodo1" },
    { header: "Periodo 2", accessor: "periodo2" },
    { header: "Periodo 3", accessor: "periodo3" },
    { header: "Periodo 4", accessor: "periodo4" },
    { header: "Periodo 5", accessor: "periodo5" },
    { header: "Periodo 6", accessor: "periodo6" },
    { header: "Total avance en periodo", accessor: "periodProgress" },
  ];

  return (
    <div className="indicator-container">
      <button
        className="open-modal-btn"
        onClick={() => setModalOpen(true)}>
        Agregar Progreso
      </button>
      <div className="professor-table">
        <h3>Profesores Registrados</h3>
        <Table
          columns={columns}
          data={processedData}
        />
      </div>
    
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}>
        <h2>Registrar Progreso</h2>
        <Formik
          initialValues={{
            teacher_id: "",
            course_id: "",
            period: "",
            percentage: "",
          }}
          onSubmit={handleSubmit}>
          {({ values, setFieldValue }) => (
            <Form className="form">
              <TeacherSelector
                name="teacher_id"
                value={values.teacher_id}
                onChange={(e) => setFieldValue("teacher_id", e.target.value)}
                required={true}
              />
              <CourseSelectByTeacher
                label="Curso"
                name="course_id"
                required={true}
                teacherId={values.teacher_id} // Pass selected teacherId here
                onChange={(e) => setFieldValue("course_id", e.target.value)}
                value={values.course_id}
              />

              <PeriodoSelect
                name="period"
                label={"Periodo"}
                value={values.period}
                onChange={(e) => setFieldValue("period", e.target.value)}
                required={true}
              />
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
