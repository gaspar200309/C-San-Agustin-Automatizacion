import React from 'react';
import { Bar, Pie, Line, Scatter, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, RadialLinearScale, Title, Tooltip, Legend, Filler } from 'chart.js';
import { PiNotePencilBold } from '../../hooks/icons';
import SearchBar from '../../components/searchBar/SearchBar';
import { countIndicator } from '../../api/api';
import useFetchData from '../../hooks/useFetchData';
import './Dashboard.css'; 


// Register the components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {

  const { data: countIndicators, loading: loadingIndicator, error: errorIndicator} = useFetchData(countIndicator);

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [3000, 5000, 4000, 7000, 2000, 8000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['Electronics', 'Fashion', 'Home Appliances'],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'User Signups',
        data: [200, 300, 500, 700],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      },
    ],
  };

  const areaData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue',
        data: [10000, 15000, 13000, 17000],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const radarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: 'A dataset',
        data: [
          { x: -10, y: 0 },
          { x: 0, y: 10 },
          { x: 10, y: 5 },
          { x: 0.5, y: 5.5 }
        ],
        backgroundColor: 'rgb(255, 99, 132)'
      }
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const barOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Monthly Sales'
      }
    }
  };

  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Revenue Distribution'
      }
    }
  };

  const lineOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Weekly User Signups'
      }
    }
  };

  const areaOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Quarterly Revenue'
      }
    }
  };

  const radarOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Skills Comparison'
      }
    }
  };

  const scatterOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Scatter Plot Example'
      }
    }
  };

  if (loadingIndicator) {
    return <div>Cargando...</div>;
  }
  
  if (errorIndicator) {
    return <div>Error al cargar los datos: {errorIndicator.message}</div>;
  }
  

  return (
    <div className="parent">
      <div className="div1">
      <h1>Dasboard</h1>
      </div>
      <div className="div2">
        <SearchBar/>
      </div>

      <div className="div3">
      <div className="counter-container1">
          <div className="counter">
            <h3><PiNotePencilBold />Total indicadores</h3>
            <p>{countIndicators.total}</p>
          </div>
        </div>
      </div>

      <div className="div4">
      <div className="counter-container2">
          <div className="counter">
            <h3><PiNotePencilBold />Total indicadores completados</h3>
            <p>{countIndicators.total}</p>
          </div>
        </div>
      </div>

      <div className="div5">
      <div className="counter-container3">
          <div className="counter">
            <h3>Total de indicadores pendientes</h3>
            <p>{countIndicators.complete}</p>
          </div>
        </div>
      </div>

      <div className="div6">
      <div className="counter-container4">
          <div className="counter">
            <h3>Total de indicadores pendientes</h3>
            <p>{countIndicators.incomplete}</p>
          </div>
        </div>
      </div>

      <div className="div7">
      
      <div className="chart-container large">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="div8">
      <div className="history-container">
          <h3>Lista de indicadores completados </h3>
          <ul>
            <li>Indicator 1</li>
            <li>Indicator 2</li>
            <li>Indicator 3</li>
          </ul>
        </div>
      </div>

      <div className="div9">
      <div className="chart-container">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="div10">
      <div className="chart-container">
          <Line data={areaData} options={areaOptions} />
        </div>
      </div>
      <div className="div11">
        <div className="chart-container">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
      <div className="div12">
      <div className="chart-container">
          <Pie data={pieData} options={pieOptions} />
        </div> 
      </div>
    </div>
  );
}
