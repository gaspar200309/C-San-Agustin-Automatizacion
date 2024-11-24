import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Toaster } from "sonner";
import { getStatisticsByIndicator } from "../../api/api";
import "./GraphIndicador2.css";

const GraphIndicator6 = () => {
  const indicatorId = 6; // ID de indicador fijo
  const [periodId, setPeriodId] = useState(1); // Período inicial
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStatisticsByIndicator(indicatorId, periodId); // Nueva llamada a la API
      setStatistics(res.data.statistics || []);
    } catch (err) {
      setError(err);
      console.error("Error al obtener las estadísticas:", err);
    } finally {
      setLoading(false);
    }
  }, [indicatorId, periodId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePeriodChange = (e) => {
    setPeriodId(parseInt(e.target.value));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Preparar los datos para la gráfica de barras
  const barData = statistics.map((stat) => ({
    name: stat.course_name,
    percentage: stat.percentage,
  }));

  return (
    <div className="graph-indicator">
      <Toaster />
      <div className="graph-title-container">
        <h3 className="graph-title">Estadísticas por Período - Indicador {indicatorId}</h3>
        <select value={periodId} onChange={handlePeriodChange} className="period-select">
          <option value={1}>Período 1</option>
          <option value={2}>Período 2</option>
          <option value={3}>Período 3</option>
          <option value={4}>Período 4</option>
        </select>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="percentage" fill="#36A2EB" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraphIndicator6;
