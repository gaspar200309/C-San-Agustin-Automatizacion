import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { countDocuments } from '../../api/api';

import './DocumentStatus.css';

// Registramos los elementos necesarios para el gráfico de torta
ChartJS.register(ArcElement, Tooltip, Legend);

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
        throw new Error('Datos no válidos');
      }
    } catch (error) {
      console.error('Error fetching document counts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: ['Entregados', 'No Entregados'],
    datasets: [
      {
        data: [counts.delivered, counts.not_delivered],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)', // Verde azulado para entregados
          'rgba(255, 99, 132, 0.8)', // Rojo para no entregados
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
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
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DocumentStats;