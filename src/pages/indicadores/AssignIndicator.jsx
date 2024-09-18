import React, { useState } from 'react';
import { getIndicator, getUsers } from '../../api/api';
import useFetchData from '../../hooks/useFetchData';
import Modal from '../../components/modal/Modal'; 
import Switch from '../../components/selected/Switch';
import './AssignIndicator.css';

export default function AssignIndicator() {
  const { data: indicators, loading: loadingIndicator, error: errorIndicator } = useFetchData(getIndicator);
  const { data: users, loading: loadingUsers, error: errorUsers } = useFetchData(getUsers);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({});

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleOpenModal = (indicator) => {
    setSelectedIndicator(indicator);
    toggleModal();
  };

  const handleSwitchChange = (indicatorId, userId, isSelected) => {
    setAssignedUsers((prev) => ({
      ...prev,
      [indicatorId]: isSelected ? userId : null,
    }));
  };

  if (loadingIndicator || loadingUsers) return <p>Cargando...</p>;
  if (errorIndicator || errorUsers) return <p>Error cargando los datos.</p>;

  return (
    <div className="assign-indicator-container">
      <h2>Lista de Indicadores</h2>
      <ul>
        {indicators.map((indicator) => (
          <li key={indicator.id} className="indicator-item">
            <div>
              <h3>{indicator.name}</h3>
              <p>Fecha de entrega: {indicator.delivery_deadline}</p>
              <p>Resultado esperado: {indicator.expected_result}</p>
            </div>
            <button onClick={() => handleOpenModal(indicator)}>Asignar Coordinador</button>
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} onClose={toggleModal} title={`Asignar Coordinador a: ${selectedIndicator?.name}`}>
        {selectedIndicator && (
          <div>
            <h4>{selectedIndicator.name}</h4>
            <ul>
              {users.map(user => (
                <li key={user.id} className="user-item">
                  <span>{user.name}</span>
                  <Switch
                    label="Asignar"
                    value={assignedUsers[selectedIndicator.id] === user.id}
                    onChange={(e) => handleSwitchChange(selectedIndicator.id, user.id, e.target.checked)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
