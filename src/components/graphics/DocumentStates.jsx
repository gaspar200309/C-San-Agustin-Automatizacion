import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { countDocuments } from '../../api/api'; 
import './DocumentStatus.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
    labels: ['Total', 'Entregados', 'No Entregados'],
    datasets: [
      {
        label: 'Documentos',
        data: [counts.total, counts.delivered, counts.not_delivered],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="document-stats">
      <h2>Estadísticas de Documentos</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DocumentStats;