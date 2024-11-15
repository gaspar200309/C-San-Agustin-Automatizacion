import React, { useState, useEffect, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import { Toaster } from 'sonner';
import { getStatusIndicator } from '../../api/api';
import './GraphIndicador2.css';

const GraphIndicador2 = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStatusIndicator(2);
      setStatistics(res.data.statistics || {});
    } catch (err) {
      setError(err);
      console.error('Error al obtener las estadísticas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Extraemos los conteos de los estados
  const { state_counts } = statistics;

  const data = {
    labels: ['Sí', 'No', 'Retraso', 'No corresponde', 'Incompleto'],
    datasets: [
      {
        label: 'Cantidad de Evaluaciones por Estado',
        data: [
          state_counts?.['Sí'] || 0,
          state_counts?.['No'] || 0,
          state_counts?.['Retraso'] || 0,
          state_counts?.['No corresponde'] || 0,
          state_counts?.['Incompleto'] || 0,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFA500', '#D3D3D3', '#FF69B4'],
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} evaluaciones`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="graph-indicator">
      <Toaster />
      <h3 style={{ fontSize: '18px', color: 'var(--text-color-secundary)', marginBottom: '20px' }}>
        Estadísticas de Entrega de Plan Curricular - Contenidos (PC-C)
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GraphIndicador2;
