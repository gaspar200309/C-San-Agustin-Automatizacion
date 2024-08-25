import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Button from '../../components/buttons/Button';
import InputText from '../../components/inputs/InputText';
import Modal from '../../components/modal/Modal';
import Select from '../../components/selected/Select';
import Table from '../../components/table/Table';
import { getUsers, addUser, updateUser, deleteUser, getRoles } from '../../api/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);

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

  const columns = [
    { header: 'Nombre', accessor: 'firstName' },
    { header: 'Apellido', accessor: 'lastName' },
    { header: 'Usuario', accessor: 'username' },
    { header: 'Correo Electrónico', accessor: 'email' },
    { header: 'Tipo de Usuario', accessor: 'userType' },
    {
      header: 'Acciones',
      render: (row) => (
        <>
          <Button type="secondary" onClick={() => handleEditUser(row)}>Editar</Button>
          <Button type="danger" onClick={() => handleDeleteUser(row.id)}>Eliminar</Button>
        </>
      )
    }
  ];

  return (
    <div className="user-management-container">
      <Button type="primary" onClick={handleAddUser}>Agregar Usuario</Button>
      <Table columns={columns} data={users} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
        <Formik
          initialValues={{
            firstName: editingUser?.firstName || '',
            lastName: editingUser?.lastName || '',
            username: editingUser?.username || '',
            email: editingUser?.email || '',
            userType: editingUser?.userType || ''
          }}
          validationSchema={Yup.object({
            firstName: Yup.string().required('Requerido'),
            lastName: Yup.string().required('Requerido'),
            username: Yup.string().required('Requerido'),
            email: Yup.string().email('Correo inválido').required('Requerido'),
            userType: Yup.string().required('Requerido')
          })}
          onSubmit={handleSubmit}
        >
          <Form className="form">
            <InputText
              label="Nombre"
              name="firstName"
              required
            />
            <InputText
              label="Apellido"
              name="lastName"
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
            <Select
              label="Roles"
              name="userType"  // Match the name with Formik's initialValues
              required
            >
              <option value="">Seleccione un tipo de usuario</option>
              {roles.map((rol) => (
                <option key={rol.value} value={rol.value}>{rol.label}</option>
              ))}
            </Select>
            <Button type="primary" buttonType="submit">Guardar</Button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default UserManagement;
