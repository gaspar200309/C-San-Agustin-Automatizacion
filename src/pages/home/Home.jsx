import React from "react";
import { Bar, Pie, Line, Scatter, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
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
  Filler,
} from "chart.js";
import {
  HiUsers,
  FcComboChart,
  IoAnalyticsSharp,
  FaClockRotateLeft,
  GiTeacher
} from "../../hooks/icons";
import SearchBar from "../../components/searchBar/SearchBar";
import { countStadistc } from "../../api/api";
import useFetchData from "../../hooks/useFetchData";
import "./Dashboard.css";
import DocumentStats from "../../components/graphics/DocumentStates";
import DashboardIcon from "../../components/icon/DashboardIcon";
import GraphIndicador2 from "../../components/graphics/GraphIndicador2";
import GraphIndicador6 from "../../components/graphics/GraphIndicador6";
import GraphIndicador3 from "../../components/graphics/GraphIndicador3";
import GraphIndicator4 from "../../components/graphics/GraphIndicador4";

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

  const { data: countSummary, loading, error } = useFetchData(countStadistc);

  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [3000, 5000, 4000, 7000, 2000, 8000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const pieData = {
    labels: ["Electronics", "Fashion", "Home Appliances"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "User Signups",
        data: [200, 300, 500, 700],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const areaData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Revenue",
        data: [10000, 15000, 13000, 17000],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const radarData = {
    labels: [
      "Eating",
      "Drinking",
      "Sleeping",
      "Designing",
      "Coding",
      "Cycling",
      "Running",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "A dataset",
        data: [
          { x: -10, y: 0 },
          { x: 0, y: 10 },
          { x: 10, y: 5 },
          { x: 0.5, y: 5.5 },
        ],
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: "Monthly Sales",
      },
    },
  };

  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: "Revenue Distribution",
      },
    },
  };

  const lineOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: "Weekly User Signups",
      },
    },
  };

  const areaOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: "Quarterly Revenue",
      },
    },
  };

  const radarOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: "Skills Comparison",
      },
    },
  };

  const scatterOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: "Scatter Plot Example",
      },
    },
  };

 
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los datos: {error.message}</div>;

  return (
    <div className="parent">
      <div className="div1">
        <h1>Home</h1>
      </div>
      <div className="div2">
        <SearchBar />
      </div>

      <div className="div3">
        <div className="counter-container">
          <div className="counter">
            <div className="title-counter">
              <h3>Total usuarios</h3>
              <DashboardIcon
                icon={HiUsers}
                iconColor="#8280FF"
                bgColor="#E5E4FF"
                className="dashboard-icon"
              />
            </div>

            <p>{countSummary.total_users}</p>
            <small>
              <span>
                <IoAnalyticsSharp /> 60 %{" "}
              </span>
              Ultimos cambios
            </small>
          </div>
        </div>
      </div>

      <div className="div4">
        <div className="counter-container">
          <div className="counter">
            <div className="title-counter">
              <h3>Total profesores</h3>
              <DashboardIcon
                icon={GiTeacher }
                iconColor="#FEC53D"
                bgColor="#FFF3D6"
                className="dashboard-icon"
              />
            </div>
            <p>{countSummary.total_teachers}</p>
            <small>
              <span>
                <IoAnalyticsSharp /> 80 %{" "}
              </span>
              Ultimos cambios
            </small>
          </div>
        </div>
      </div>

      <div className="div5">
        <div className="counter-container">
          <div className="counter">
            <div className="title-counter">
              <h3>Indicadores incomplete</h3>
              <DashboardIcon
                icon={FcComboChart }
                iconColor="#FF9066"
                bgColor="#D9F7E8"
                className="dashboard-icon"
              />
            </div>
            <p>{countSummary.indicators.incomplete}</p>
            <small>
              <span>
                <IoAnalyticsSharp /> 100 %{" "}
              </span>
              Ultimos cambios
            </small>
          </div>
        </div>
      </div>

      <div className="div6">
        <div className="counter-container">
          <div className="counter">
            <div className="title-counter">
              <h3>Indicadores pendientes</h3>
              <DashboardIcon
                icon={FaClockRotateLeft }
                iconColor="#FF9066"
                bgColor="#FFDED1"
                className="dashboard-icon"
              />
            </div>
            <p>{countSummary.indicators.completed}</p>
            <small>
              <span>
                <IoAnalyticsSharp /> 0 %{" "}
              </span>
              Ultimos cambios
            </small>
          </div>
        </div>
      </div>

      <div className="div7">
        <div className="chart-container large">
           
        <GraphIndicador6/>
        </div>
      </div>

      <div className="div8">
        <div className="history-container">
          <h3>Actividades recientes </h3>
          <ul>
            <li>Indicator 1</li>
            <li>Indicator 2</li>
            <li>Indicator 3</li>
          </ul>
        </div>
      </div>

      <div className="div9">
        <div className="chart-container">
          {/* <Line
            data={lineData}
            options={lineOptions}
          /> */} <GraphIndicador3/>
        </div>
      </div>

      <div className="div10">
        <div className="chart-container">
          {/* <Line
            data={areaData}
            options={areaOptions}
          /> */}
          <GraphIndicator4/>
        </div>
      </div>
      <div className="div11">
        <div className="chart-container">
          {/* <Radar data={radarData} options={radarOptions} /> */}
          <DocumentStats />
        </div>
      </div>
      <div className="div12">
        <div className="chart-container">
          {/* <Pie
            data={pieData}
            options={pieOptions}
          /> */}
          <GraphIndicador2 />
        </div>
      </div>
    </div>
  );
}
