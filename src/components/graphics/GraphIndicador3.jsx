import React, { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Toaster } from "sonner";
import { getStatusIndicator } from "../../api/api";
import "./GraphIndicador2.css";

const GraphIndicador3 = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStatusIndicator(3); // Indicador 3
      setStatistics(res.data.statistics || {});
    } catch (err) {
      setError(err);
      console.error("Error al obtener las estadísticas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Extraemos datos
  const { delivered_count, not_delivered_count, state_counts } = statistics;

  // Datos para el gráfico de barras
  const barData = [
    { name: "Sí", count: state_counts?.["Sí"] || 0 },
    { name: "No", count: state_counts?.["No"] || 0 },
    { name: "Retraso", count: state_counts?.["Retraso"] || 0 },
    { name: "No corresponde", count: state_counts?.["No corresponde"] || 0 },
    { name: "Incompleto", count: state_counts?.["Incompleto"] || 0 },
  ];

  // Datos para el gráfico de torta
  const pieData = [
    { name: "Entregados", value: delivered_count || 0, color: "#4BC0C0" },
    { name: "No Entregados", value: not_delivered_count || 0, color: "#FF6384" },
  ];

  return (
    <div className="graph-indicator">
      <Toaster />
      <h3 className="graph-title">Estadísticas de Entrega de Plan Curricular - Indicador 3</h3>
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

export default GraphIndicador3;
