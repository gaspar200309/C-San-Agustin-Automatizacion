import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Toaster } from "sonner";
import { getStatisticsByTrimester } from "../../api/api";
import "./GraphIndicador2.css";

const GraphIndicator4 = () => {
  const indicatorId = 4; // ID de indicador fijo
  const [trimesterId, setTrimesterId] = useState(1); // Trimestre inicial
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStatisticsByTrimester(indicatorId, trimesterId);
      setStatistics(res.data.statistics || {});
    } catch (err) {
      setError(err);
      console.error("Error al obtener las estadísticas:", err);
    } finally {
      setLoading(false);
    }
  }, [indicatorId, trimesterId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTrimesterChange = (e) => {
    setTrimesterId(parseInt(e.target.value));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Extraer datos
  const { delivered_count, not_delivered_count, state_counts } = statistics;

  const barData = Object.entries(state_counts || {}).map(([key, value]) => ({
    name: key,
    count: value,
  }));

  const pieData = [
    { name: "Entregados", value: delivered_count || 0, color: "#4BC0C0" },
    { name: "No Entregados", value: not_delivered_count || 0, color: "#FF6384" },
  ];

  return (
    <div className="graph-indicator">
      <Toaster />
      <div className="graph-title-container">
        <h3 className="graph-title">Estadísticas por Trimestre - Indicador {indicatorId}</h3>
        <select value={trimesterId} onChange={handleTrimesterChange} className="trimester-select">
          <option value={1}>Trimestre 1</option>
          <option value={2}>Trimestre 2</option>
          <option value={3}>Trimestre 3</option>
          <option value={4}>Trimestre 4</option>
        </select>
      </div>

      <div className="chart-overlay-container">
        {/* Gráfico de barras */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#36A2EB" />
          </BarChart>
        </ResponsiveContainer>

        {/* Gráfico de torta */}
        <div className="pie-overlay">
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                fill="#8884d8"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraphIndicator4;
