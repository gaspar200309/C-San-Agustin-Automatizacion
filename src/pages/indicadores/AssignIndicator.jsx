import React, { useState } from 'react';
import { getIndicator, getUsers, assignCoordinatorToIndicator, removeCoordinatorFromIndicator, getIndicatorAssignements } from '../../api/api';
import useFetchData from '../../hooks/useFetchData';
import Modal from '../../components/modal/Modal';
import Switch from '../../components/selected/Switch';
import { Button } from '../../components/buttons/Button';
import './AssignIndicator.css';
import LinkButton from '../../components/buttons/LinkButton';

export default function AssignIndicator() {
  const { data: indicators, loading: loadingIndicator, error: errorIndicator } = useFetchData(getIndicator);
  const { data: users, loading: loadingUsers, error: errorUsers } = useFetchData(getUsers);
  const {
    data: assignedIndicators,
    loading: loadingAssignments,
    error: errorAssignments,
    refetch: refetchAssignments
  } = useFetchData(getIndicatorAssignements);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [pendingChanges, setPendingChanges] = useState({});

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setPendingChanges({});
    }
  };

  const handleOpenModal = (indicator) => {
    setSelectedIndicator(indicator);
    toggleModal();
  };

  // Verifica si un usuario está asignado a un indicador
  const isUserAssigned = (indicatorId, userId) => {
    const indicator = assignedIndicators?.find(ind => ind.id === indicatorId);
    return indicator?.coordinators.some(coord => coord.id === userId) || false;
  };

  const handleSwitchChange = (indicatorId, userId, isSelected) => {
    setPendingChanges(prev => ({
      ...prev,
      [userId]: {
        value: isSelected,
        original: isUserAssigned(indicatorId, userId)
      }
    }));
  };

  const handleUpdate = async () => {
    if (!selectedIndicator) return;

    try {
      const updatePromises = Object.entries(pendingChanges).map(([userId, change]) => {
        if (change.value !== change.original) {
          return change.value
            ? assignCoordinatorToIndicator(selectedIndicator.id, parseInt(userId))
            : removeCoordinatorFromIndicator(selectedIndicator.id, parseInt(userId));
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      await refetchAssignments();
      toggleModal();
    } catch (error) {
      console.error('Error actualizando las asignaciones:', error);
    }
  };

  const hasChanges = Object.values(pendingChanges).some(
    change => change.value !== change.original
  );

  if (loadingIndicator || loadingUsers || loadingAssignments) {
    return <p>Cargando...</p>;
  }

  if (errorIndicator || errorUsers || errorAssignments) {
    return <p>Error cargando los datos.</p>;
  }

  return (
    <div className="assign-indicator-container">
      <LinkButton to="registerIndicator" className="indicador-button">
        Registrar indicador
      </LinkButton>
      <h2>Lista de Indicadores</h2>
      <ul className="indicator-list">
        {indicators.map((indicator) => (
          <li key={indicator.id} className="indicator-card">
            <div className="indicator-content">
              <h3>{indicator.name}</h3>
              <div className="coordinator-tags">
                {assignedIndicators
                  ?.find(ind => ind.id === indicator.id)
                  ?.coordinators.map(coord => (
                    <span key={coord.id} className="coordinator-tag">
                      {coord.username}
                    </span>
                  )) || <span>No hay coordinadores asignados</span>}
              </div>
              <Button onClick={() => handleOpenModal(indicator)}>
                Asignar Coordinadores
              </Button>
            </div>
          </li>
        ))}
      </ul>


      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        title={`Asignar Coordinadores a: ${selectedIndicator?.name}`}
      >
        {selectedIndicator && (
          <div className="modal-content">
            <h4>{selectedIndicator.name}</h4>
            <ul className="users-list">
              {users.map(user => {
                // Verificar si el usuario ya está asignado al indicador seleccionado
                const isAssigned = isUserAssigned(selectedIndicator.id, user.id);
                const isPending = pendingChanges[user.id]?.value;

                return (
                  <li key={user.id} className="user-item">
                    <span className="user-name">{user.username}</span>
                    <Switch
                      label="Asignar"
                      // Mostrar el estado correcto del switch
                      value={isPending !== undefined ? isPending : isAssigned}
                      onChange={(e) => handleSwitchChange(
                        selectedIndicator.id,
                        user.id,
                        e.target.checked
                      )}
                    />
                  </li>
                );
              })}
            </ul>
            <div className="modal-actions">
              <Button
                onClick={handleUpdate}
                disabled={!hasChanges}
                className={!hasChanges ? 'button-disabled' : ''}
              >
                Actualizar
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}