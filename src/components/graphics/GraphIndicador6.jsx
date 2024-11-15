import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import PeriodoSelect from "../selected/PeriodoSelect";

const GraphIndicador6 = ({ evaluations, selectedPeriod, onPeriodChange }) => {
  // Extract courses and their progress for the selected period
  const barData = useMemo(() => {
    const labels = [];
    const data = [];

    evaluations.forEach((teacher) => {
      Object.keys(teacher.courses).forEach((courseName) => {
        const course = teacher.courses[courseName];
        const progress = course.periods[selectedPeriod] || 0;
        labels.push(`${teacher.teacher_name} - ${courseName}`);
        data.push(progress);
      });
    });

    return {
      labels,
      datasets: [
        {
          label: `Progreso en ${selectedPeriod}`,
          data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  }, [evaluations, selectedPeriod]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Avance en los cursos para el periodo ${selectedPeriod}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <PeriodoSelect
        name="period"
        label="Seleccione el Periodo"
        onChange={onPeriodChange}
      />
      <div style={{ height: "400px" }}>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default GraphIndicador6;
