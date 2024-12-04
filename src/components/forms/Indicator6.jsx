import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Modal from "../modal/Modal";
import TeacherSelector from "../selected/TeacherSelector";
import PeriodoSelect from "../selected/PeriodoSelect";
import Table from "../table/Table";
import { Button } from "../buttons/Button";
import { registerStatusIndicador6, getStatusIndicator6 } from "../../api/api";
import CoursesByTeacherInputs from "../inputs/CoursesByTeacherInputs";

const Indicator6 = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [coursePercentages, setCoursePercentages] = useState({});
  const [summary, setSummary] = useState({
    total_percentage_all: 0,
    total_count_all: 0,
    overall_average_all: 0,
  });

  const handlePercentageChange = (courseId, percentage) => {
    setCoursePercentages((prevPercentages) => ({
      ...prevPercentages,
      [courseId]: percentage,
    }));
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await getStatusIndicator6(6);

      const { results, summary } = response.data;

      // Process the data to create a flat structure for the table
      const flattenedData = results.map((teacher) => {
        const periodData = { ...teacher.periods };
        return {
          teacher_name: teacher.teacher_name.trim(),
          ...periodData,
          overall_average: teacher.overall_average,
        };
      });

      setProcessedData(flattenedData);
      setSummary(summary);
    } catch (error) {
      console.error("Error al obtener evaluaciones:", error);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const data = Object.keys(coursePercentages)
        .filter((courseId) => coursePercentages[courseId])
        .map((courseId) => ({
          teacher_id: parseInt(values.teacher_id),
          course_id: parseInt(courseId),
          period_id: parseInt(values.period),
          percentage: parseInt(coursePercentages[courseId]),
        }));

      if (data.length === 0) {
        alert("Por favor, ingresa al menos un porcentaje válido.");
        return;
      }

      await registerStatusIndicador6(data);
      await fetchEvaluations();
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  const generateColumns = () => {
    if (processedData.length === 0) return [];

    const periodKeys = Object.keys(processedData[0])
      .filter((key) => key !== "teacher_name" && key !== "overall_average")
      .sort((a, b) => parseInt(a) - parseInt(b));

    return [
      { header: "Profesor", accessor: "teacher_name" },
      ...periodKeys.map((period) => ({
        header: `Periodo ${period}`,
        accessor: period,
      })),
      { header: "Promedio Total", accessor: "overall_average" },
    ];
  };

  return (
    <div className="indicator-container">
      <button className="open-modal-btn" onClick={() => setModalOpen(true)}>
        Registar indicador
      </button>

      <div className="professor-table">
        <h3>Índice de cumplimiento de avance curricular por períodos.</h3>
        <Table columns={generateColumns()} data={processedData} />
      </div>
      <div className="summary">
        <h3>Resumen General</h3>
        <p>Total de porcentajes: {summary.total_percentage_all}</p>
        <p>Total de evaluaciones: {summary.total_count_all}</p>
        <p>Promedio general: {summary.overall_average_all}</p>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Registrar Progreso</h2>
        <Formik
          initialValues={{
            teacher_id: "",
            period: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="form">
              <TeacherSelector
                name="teacher_id"
                value={values.teacher_id}
                onChange={(e) => setFieldValue("teacher_id", e.target.value)}
                required
              />
              <PeriodoSelect
                name="period"
                label="Periodo"
                value={values.period}
                onChange={(e) => setFieldValue("period", e.target.value)}
                required
              />
              <CoursesByTeacherInputs
                teacherId={values.teacher_id}
                onChange={handlePercentageChange}
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
