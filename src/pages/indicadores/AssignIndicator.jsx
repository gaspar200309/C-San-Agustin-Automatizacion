import React, { useState, useEffect } from 'react';
import { getIndicator, getUsers, assignCoordinatorToIndicator, removeCoordinatorFromIndicator, getAssignCoordinatorToIndicator } from '../../api/api';
import useFetchData from '../../hooks/useFetchData';
import Modal from '../../components/modal/Modal'; 
import Switch from '../../components/selected/Switch';
import { Button } from '../../components/buttons/Button';
import './AssignIndicator.css';

export default function AssignIndicator() {
  const { data: indicators, loading: loadingIndicator, error: errorIndicator } = useFetchData(getIndicator);
  const { data: users, loading: loadingUsers, error: errorUsers } = useFetchData(getUsers);
  const { data: indicatorAssign, loading: loadingIndicatorAss, error: errorIndicatorAss } = useFetchData(getAssignCoordinatorToIndicator);
  /* QUiero qu */

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleOpenModal = (indicator) => {
    setSelectedIndicator(indicator);
    toggleModal();
  };

  const handleSwitchChange = (indicatorId, userId, isSelected) => {
    setPendingChanges((prev) => ({
      ...prev,
      [indicatorId]: {
        ...prev[indicatorId],
        [userId]: isSelected,
      },
    }));
  };

  const handleUpdate = async () => {
    try {
      const changes = pendingChanges[selectedIndicator.id] || {};

      for (const [userId, isSelected] of Object.entries(changes)) {
        if (isSelected) {
          await assignCoordinatorToIndicator(selectedIndicator.id, userId);
        } else {
          await removeCoordinatorFromIndicator(selectedIndicator.id, userId);
        }
      }

      // Update assigned users state
      setAssignedUsers((prev) => ({
        ...prev,
        [selectedIndicator.id]: Object.entries(changes).reduce((acc, [userId, isSelected]) => {
          if (isSelected) return [...acc, parseInt(userId)];
          return acc.filter((id) => id !== parseInt(userId));
        }, prev[selectedIndicator.id] || []),
      }));

      setPendingChanges((prev) => ({
        ...prev,
        [selectedIndicator.id]: {},
      }));

      toggleModal();
    } catch (error) {
      console.error('Error actualizando los cambios:', error);
    }
  };

  if (loadingIndicator || loadingUsers || loadingIndicatorAss) return <p>Cargando...</p>;
  if (errorIndicator || errorUsers || errorIndicatorAss) return <p>Error cargando los datos.</p>;

  return (
    <div>
      <h2>Lista de Indicadores</h2>
      <ul>
        {indicators.map((indicator) => (
          <li key={indicator.id} className="indicator-item">
            <h3>{indicator.name}</h3>
            <p>Fecha de entrega: {indicator.delivery_deadline}</p>
            <p>Resultado esperado: {indicator.expected_result}</p>
            <button onClick={() => handleOpenModal(indicator)}>Asignar Coordinadores</button>
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} onClose={toggleModal} title={`Asignar Coordinadores a: ${selectedIndicator?.name}`}>
        {selectedIndicator && (
          <div>
            <h4>{selectedIndicator.name}</h4>
            <ul>
              {users.map(user => {
                const isAssigned = indicatorAssign.find(ind => ind.id === selectedIndicator.id)?.coordinators.some(coord => coord.id === user.id);
                
                return (
                  <li key={user.id} className="user-item">
                    <span>{user.username}</span>
                    <Switch
                      label="Asignar"
                      value={(pendingChanges[selectedIndicator.id]?.[user.id] !== undefined
                        ? pendingChanges[selectedIndicator.id]?.[user.id]
                        : isAssigned)}
                      onChange={(e) => handleSwitchChange(selectedIndicator.id, user.id, e.target.checked)}
                    />
                  </li>
                );
              })}
            </ul>
            <Button onClick={handleUpdate}>Actualizar</Button> 
          </div>
        )}
      </Modal>
    </div>
  );
}
