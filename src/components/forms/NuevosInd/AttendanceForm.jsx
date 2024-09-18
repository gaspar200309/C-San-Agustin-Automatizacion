import React, { useState } from 'react';
import { getIndicator, getUsers, assignCoordinatorToIndicator, removeCoordinatorFromIndicator } from '../../api/api'; // Nuevas API
import useFetchData from '../../hooks/useFetchData';
import Modal from '../../components/modal/Modal'; 
import Switch from '../../components/selected/Switch';

export default function AssignIndicator() {
  const { data: indicators, loading: loadingIndicator, error: errorIndicator } = useFetchData(getIndicator);
  const { data: users, loading: loadingUsers, error: errorUsers } = useFetchData(getUsers);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState({});  // Clave de indicador -> lista de IDs de usuarios asignados

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleOpenModal = (indicator) => {
    setSelectedIndicator(indicator);
    toggleModal();
  };

  const handleSwitchChange = async (indicatorId, userId, isSelected) => {
    try {
      if (isSelected) {
        // Asignar el usuario como coordinador
        await assignCoordinatorToIndicator(indicatorId, userId);
      } else {
        // Quitar asignación
        await removeCoordinatorFromIndicator(indicatorId, userId);
      }
      // Actualizar el estado local después de la asignación
      setAssignedUsers((prev) => ({
        ...prev,
        [indicatorId]: isSelected
          ? [...(prev[indicatorId] || []), userId]
          : (prev[indicatorId] || []).filter((id) => id !== userId)
      }));
    } catch (error) {
      console.error("Error en la asignación/desasignación:", error);
    }
  };

  if (loadingIndicator || loadingUsers) return <p>Cargando...</p>;
  if (errorIndicator || errorUsers) return <p>Error cargando los datos.</p>;

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
              {users.map(user => (
                <li key={user.id} className="user-item">
                  <span>{user.name}</span>
                  <Switch
                    label="Asignar"
                    value={(assignedUsers[selectedIndicator.id] || []).includes(user.id)}
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
