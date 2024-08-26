import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { Button } from '../../components/buttons/Button';
import InputText from '../../components/inputs/InputText'
import Modal from '../../components/modal/Modal';
import Select from '../../components/selected/Select';
import Table from '../../components/table/Table';
import SearchBar from '../../components/searchBar/SearchBar';
import { FaEdit, MdDelete } from '../../hooks/icons'
import { getUsers, addUser, updateUser, deleteUser, getRoles } from '../../api/api';
import { getUser } from '../login/authFunctions'; 
import './ListUser.css'

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const currentUser = getUser(); 

  useEffect(() => {
    getRoles().then(response => {
      setRoles(response.data.map(rol => ({
        value: rol.id,
        label: rol.name
      })));
    });
  }, []);

  useEffect(() => {
    getUsers().then(response => setUsers(response.data));
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
      setUsers(users.filter(user => user.id !== userId));
    });
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editingUser) {
      updateUser(editingUser.id, values).then(() => {
        setUsers(users.map(user => (user.id === editingUser.id ? { ...user, ...values } : user)));
      });
    } else {
      addUser(values).then(response => {
        setUsers([...users, response.data]);
      });
    }
    resetForm();
    setModalOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filterText.toLowerCase()) ||
    user.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
    user.username.toLowerCase().includes(filterText.toLowerCase()) ||
    user.email.toLowerCase().includes(filterText.toLowerCase()) ||
    user.role.toLowerCase().includes(filterText.toLowerCase())
  );

  const isAdmin = currentUser?.roles.includes('Administrador');

  const columns = [
    { header: 'Nombre', accessor: 'name' },
    { header: 'Apellido', accessor: 'last_name' },
    { header: 'Usuario', accessor: 'username' },
    { header: 'Correo Electrónico', accessor: 'email' },
    { header: 'Tipo de Usuario', accessor: 'role' },
    isAdmin && {
      header: 'Acciones',
      render: (row) => (
        <div className="user-management-table-actions">
          <Button type="secondary" onClick={() => handleEditUser(row)}><FaEdit /></Button>
          <Button type="danger" onClick={() => handleDeleteUser(row.id)}><MdDelete /></Button>
        </div>
      )
    }
  ].filter(Boolean);

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2 className="user-management-title">Gestión de Usuarios</h2>
        
        {isAdmin && (
          <Button type="primary" onClick={handleAddUser}>Agregar Usuario</Button>
        )}
      </div>
      <Table columns={columns} data={filteredUsers} className="user-management-table" />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <Formik
          initialValues={{
            name: editingUser?.name || '',
            last_name: editingUser?.last_name || '',
            username: editingUser?.username || '',
            email: editingUser?.email || '',
            password: '', // Initialize password as empty
            role: editingUser?.role || ''
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Requerido'),
            last_name: Yup.string().required('Requerido'),
            username: Yup.string().required('Requerido'),
            email: Yup.string().email('Correo inválido').required('Requerido'),
            password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
            role: Yup.string().required('Requerido')
          })}
          onSubmit={handleSubmit}
        >
          <Form className="form">
            <InputText
              label="Nombre"
              name="name"
              required
            />
            <InputText
              label="Apellido"
              name="last_name"
              required
            />
            <InputText
              label="Usuario"
              name="username"
              required
            />
            <InputText
              label="Correo Electrónico"
              name="email"
              required
            />
            <InputText
              label="Contraseña"
              name="password"
              type="password"
              required
            />
            <Select
              label="Roles"
              name="role"
              required
            >
              <option value="">Seleccione un tipo de usuario</option>
              {roles.map((rol) => (
                <option key={rol.value} value={rol.label}>{rol.label}</option>
              ))}
            </Select>
            <Button variant="primary" type="submit">Guardar</Button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default UserManagement;
