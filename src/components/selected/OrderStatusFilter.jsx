import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import "./OrderStatusFilter.css";

const OrderStatusFilter = ({ onApply }) => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Abierto por defecto
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const statuses = [
    { label: "Completed", id: "completed" },
    { label: "Processing", id: "processing" },
    { label: "Rejected", id: "rejected" },
    { label: "On Hold", id: "onHold" },
    { label: "In Transit", id: "inTransit" },
  ];

  const toggleStatus = (id) => {
    if (selectedStatuses.includes(id)) {
      setSelectedStatuses(selectedStatuses.filter((status) => status !== id));
    } else {
      setSelectedStatuses([...selectedStatuses, id]);
    }
  };

  const handleApply = () => {
    onApply(selectedStatuses);
    setIsModalOpen(false);
  };

  return (
    <div className="filter-container">
      <button className="filter-button" onClick={() => setIsModalOpen(!isModalOpen)}>
        <FaFilter /> Filter By
      </button>
      <button className="filter-button" onClick={() => setIsModalOpen(!isModalOpen)}>
        <FaFilter /> Filter By
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Order Status</h3>
            <div className="status-buttons">
              {statuses.map(({ label, id }) => (
                <button
                  key={id}
                  className={`status-button ${selectedStatuses.includes(id) ? "selected" : ""}`}
                  onClick={() => toggleStatus(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p>*You can choose multiple Order Status</p>
            <div className="modal-actions">
              <button className="apply-button" onClick={handleApply}>
                Apply Now
              </button>
              <button className="reset-button" onClick={() => setSelectedStatuses([])}>
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusFilter;
