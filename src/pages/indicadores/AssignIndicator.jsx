import React, { useState } from 'react';
import useFetchData from '../../hooks/useFetchData';
import { getIndicator, getUserByIdIndicator, removeCoordinatorFromIndicator, getUsers, assignCoordinatorToIndicator } from '../../api/api';
import LinkButton from '../../components/buttons/LinkButton';
import Modal from '../../components/modal/Modal';
import { FaTrash } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';
import './AssignIndicator.css';

export default function AssignIndicator() {
  const { data: indicators, loading: loadingIndicator, error: errorIndicator } = useFetchData(getIndicator);
  const { data: users, loading: loadingUsers, error: errorUsers } = useFetchData(getUsers);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleViewDetails = async (indicator) => {
    setSelectedIndicator(indicator);
    setLoadingDetails(true);
    try {
      const response = await getUserByIdIndicator(indicator.id);
      setAssignedUsers(response.data || []);
    } catch (error) {
      console.error('Error al cargar los usuarios asignados:', error);
      setAssignedUsers([]);
    } finally {
      setLoadingDetails(false);
      toggleModal();
    }
  };

  const handleRemoveCoordinator = async (indicatorId, userId) => {
    try {
      await removeCoordinatorFromIndicator(indicatorId, userId);
      setAssignedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success('Coordinador eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar coordinador:', error);
      toast.error('No se pudo eliminar al coordinador.');
    }
  };

  const handleAddCoordinator = async () => {
    if (!selectedUser) {
      toast.warning('Por favor, selecciona un usuario para asignar.');
      return;
    }
    try {
      await assignCoordinatorToIndicator(selectedIndicator.id, selectedUser.id);
      setAssignedUsers((prevUsers) => [...prevUsers, selectedUser]);
      toast.success('Coordinador asignado correctamente.');
    } catch (error) {
      console.error('Error al asignar coordinador:', error);
      toast.error('No se pudo asignar al coordinador, porque ya fue asignado  .');
    }
  };

  if (loadingIndicator) {
    return <p>Cargando...</p>;
  }

  if (errorIndicator) {
    return <p>Error cargando los datos.</p>;
  }

  return (
    <div className="assign-indicator-container">
      <Toaster position="top-right" />
      <LinkButton to="registerIndicator" className="indicador-button">
        Registrar indicador
      </LinkButton>
      <ul className="indicator-list">
        {indicators.map((indicator) => (
          <li key={indicator.id} className="indicator-card">
            <div className="indicator-content">
              <h3>{indicator.name}</h3>
              <button
                className="view-details-button"
                onClick={() => handleViewDetails(indicator)}
              >
                Ver Detalles
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} onClose={toggleModal} title="Detalles del Indicador">
        {loadingDetails ? (
          <p>Cargando detalles...</p>
        ) : (
          selectedIndicator && (
            <div className="modal-conten">
              <h3>{selectedIndicator.name}</h3>
              <ul className="assigned-users-list">
                {assignedUsers.map((user) => (
                  <li key={user.id} className="assigned-user-item">
                    <img src={user.photo} alt={user.name} className="user-photo" />
                    <span>{user.name}</span>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveCoordinator(selectedIndicator.id, user.id)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="assign-user-section">
                <select
                  value={selectedUser ? selectedUser.id : ""}
                  onChange={(e) => {
                    const userId = parseInt(e.target.value, 10);
                    const user = users.find((u) => u.id === userId);
                    setSelectedUser(user);
                  }}
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <button className="assign-button" onClick={handleAddCoordinator}>
                  Asignar Usuario
                </button>
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
}
