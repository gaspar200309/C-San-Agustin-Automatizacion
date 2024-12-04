import React, { useState } from "react";
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
  GiTeacher,
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
import OrderStatusFilter from "../../components/selected/OrderStatusFilter";

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
  const handleApplyFilter = (statuses) => {
    console.log('Selected statuses:', statuses);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los datos: {error.message}</div>;

  return (
    <div className="parent">
      <div className="div1">
        <h1>Home</h1>
      </div>
      <OrderStatusFilter
  onApply={(selectedStatuses) => {
    console.log("Filtros aplicados: ", selectedStatuses);
  }}
/>

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
              Últimos cambios
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
                icon={GiTeacher}
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
              Últimos cambios
            </small>
          </div>
        </div>
      </div>

      <div className="div5">
        <div className="counter-container">
          <div className="counter">
            <div className="title-counter">
              <h3>Indicadores incompletos</h3>
              <DashboardIcon
                icon={FcComboChart}
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
              Últimos cambios
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
                icon={FaClockRotateLeft}
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
              Últimos cambios
            </small>
          </div>
        </div>
      </div>

      <div className="div7">
        <div className="chart-container large">
          {/* Gráfico Estático 1 */}
          <GraphIndicador6 />
        </div>
      </div>

      <div className="div8">
        <div className="history-container">
          <h3>Actividades recientes </h3>
          <ul>
            <li>Indicador 1</li>
            <li>Indicador 2</li>
            <li>Indicador 3</li>
          </ul>
        </div>
      </div>

      <div className="div9">
        <div className="chart-container">
          {/* Gráfico Estático 2 */}
          <GraphIndicador3 />
        </div>
      </div>

      <div className="div10">
        <div className="chart-container">
          {/* Gráfico Estático 3 */}
          <GraphIndicator4 />
        </div>
      </div>
      <div className="div11">
        <div className="chart-container">
          {/* Gráfico Estático 4 */}
          <DocumentStats />
        </div>
      </div>
      <div className="div12">
        <div className="chart-container">
          {/* Gráfico Estático 5 */}
          <GraphIndicador2 />
        </div>
      </div>
    </div>
  );
}
