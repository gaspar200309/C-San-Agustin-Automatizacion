import React, { useState, useEffect } from 'react';
import { Button } from '../../components/buttons/Button';
import Modal from '../../components/modal/Modal';
import Table from '../../components/table/Table';
import SearchBar from '../../components/searchBar/SearchBar';
import { FaEdit, MdDelete } from '../../hooks/icons';
import { getUsers, addUser, updateUser, deleteUser, getRoles } from '../../api/api';
import { getUser } from '../login/authFunctions';
import UserForm from './RegisterUser';
import './ListUser.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const currentUser = getUser();

  useEffect(() => {
    getRoles().then((response) => {
      setRoles(
        response.data.map((rol) => ({
          value: rol.id,
          label: rol.name,
        }))
      );
    });
  }, []);

  useEffect(() => {
    getUsers().then((response) => setUsers(response.data));
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId).then(() => {
      setUsers(users.filter((user) => user.id !== userId));
    });
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingUser) {
      updateUser(editingUser.id, values).then(() => {
        setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...values } : user)));
      });
    } else {
      addUser(values).then((response) => {
        setUsers([...users, response.data]);
      });
    }
    resetForm();
    setModalOpen(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.username?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.role?.toLowerCase().includes(filterText.toLowerCase())
  );
  
  const isAdmin = currentUser?.roles.includes('Administrador');

  const columns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellido', accessor: 'last_name' },
    { header: 'Usuario', accessor: 'username' },
    { header: 'Correo Electrónico', accessor: 'email' },
    { header: 'Tipo de Usuario', accessor: 'roles' },
    isAdmin && {
      header: 'Acciones',
      render: (row) => (
        <div className="user-management-table-actions">
          <Button type="secondary" onClick={() => handleEditUser(row)}>
            <FaEdit />
          </Button>
          <Button type="danger" onClick={() => handleDeleteUser(row.id)}>
            <MdDelete />
          </Button>
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2 className="user-management-title">Gestión de Usuarios</h2>
        {isAdmin && (
          <Button type="primary" onClick={handleAddUser}>
            Agregar Usuario
          </Button>
        )}
      </div>
      <SearchBar value={filterText} onChange={(e) => setFilterText(e.target.value)} />
      <Table columns={columns} data={filteredUsers} className="user-management-table" />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <UserForm
          initialValues={{
             name: editingUser?.name || '',
            last_name: editingUser?.last_name || '',
            username: editingUser?.username || '',
            email: editingUser?.email || '',
            password: '',
            confirmPassword: '',
            role: editingUser?.role || '',
          }}
          onSubmit={handleSubmit}
          roles={roles}
          editingUser={editingUser}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
