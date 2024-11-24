import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { countDocuments } from "../../api/api";

import "./DocumentStatus.css";

const DocumentStats = () => {
  const [counts, setCounts] = useState({ total: 0, delivered: 0, not_delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await countDocuments();
      if (response.data) {
        setCounts(response.data);
      } else {
        throw new Error("Datos no válidos");
      }
    } catch (error) {
      console.error("Error fetching document counts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Entregados", value: counts.delivered, color: "rgba(75, 192, 192, 0.8)" },
    { name: "No Entregados", value: counts.not_delivered, color: "rgba(255, 99, 132, 0.8)" },
  ];

  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} y={cy} className="fill-primary text-2xl font-bold">
          {counts.total}
        </tspan>
        <tspan
          x={cx}
          y={cy + 24}
          className="fill-muted text-base font-medium"
        >
          Total
        </tspan>
      </text>
    );
  };

  if (loading) {
    return (
      <div className="document-stats loading">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="document-stats error">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="document-stats">
      <h2>Estadísticas de Documentos</h2>
      <div className="stats-summary">
        <div className="stat-item">
          <h3>Total de Documentos</h3>
          <p>{counts.total}</p>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                label={renderCustomLabel} // Renderizador personalizado
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${value} (${percentage}%)`;
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DocumentStats;
