import{ useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "../../components/buttons/Button";
import Modal from "../../components/modal/Modal";
import Table from "../../components/table/Table";
import SearchBar from "../../components/searchBar/SearchBar";
import { FaEdit, MdDelete } from "../../hooks/icons";
import { getUsers, addUser, updateUser, deleteUser, getRoles } from "../../api/api";
import { getUser } from "../login/authFunctions";
import UserForm from "./RegisterUser";

import "./ListUser.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);  
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [serverError, setServerError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const currentUser = useMemo(() => getUser(), []);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await getRoles();
      setRoles(
        response.data.map((rol) => ({
          value: rol.id,
          label: rol.name,
        }))
      );
    };

    fetchRoles();
  }, []);

  const memoizedRoles = useMemo(() => roles, [roles]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  const handleAddUser = useCallback(() => {
    setEditingUser(null);
    setModalOpen(true);
    setServerError(null); 
  }, []);

  const handleEditUser = useCallback((user) => {
    if (user.id === currentUser.id) {
      toast.error('No puedes editar tu propio usuario.');
      return;
    }
    setEditingUser(user);
    setModalOpen(true);
    setServerError(null); 
  }, [currentUser]);

  const handleDeleteUser = useCallback(async () => {
    if (userToDelete.id === currentUser.id) {
      toast.error('No puedes eliminar tu propio usuario.');
      return;
    }
    try {
      await deleteUser(userToDelete.id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
      toast.success('Usuario eliminado exitosamente.');
    } catch (error) {
      toast.error('Error al eliminar el usuario.');
    } finally {
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  }, [userToDelete, currentUser]);

  const confirmDeleteUser = useCallback((user) => {
    if (user.id === currentUser.id) {
      toast.error('No puedes eliminar tu propio usuario.');
      return;
    }
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  }, [currentUser]);

  const handleSubmit = useCallback(
    async (values, { resetForm }) => {
      try {
        if (editingUser) {
          await updateUser(editingUser.id, values);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === editingUser.id ? { ...user, ...values } : user
            )
          );
          toast.success('Usuario actualizado exitosamente.');
        } else {
          const response = await addUser(values);
          setUsers((prevUsers) => [...prevUsers, response.data]);
          toast.success('Usuario agregado exitosamente.');
          window.location.reload();
        }
        resetForm();
        setModalOpen(false);
      } catch (error) {
        setServerError(
          error.response?.data?.error ||
            "Error del servidor al procesar la solicitud. Intente nuevamente."
        );
        toast.error('Error al procesar la solicitud.');
      }
    },
    [editingUser]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name?.toLowerCase().includes(filterText.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(filterText.toLowerCase()) ||
          user.username?.toLowerCase().includes(filterText.toLowerCase()) ||
          user.email?.toLowerCase().includes(filterText.toLowerCase()) ||
          user.role?.toLowerCase().includes(filterText.toLowerCase())
      ),
    [users, filterText]
  );

  const isAdmin = useMemo(() => currentUser?.roles.includes("Administrador"), [currentUser]);

  const columns = useMemo(
    () =>
      [
        { header: "Nombre", accessor: "name" },
        { header: "Apellido", accessor: "last_name" },
        { header: "Usuario", accessor: "username" },
        { header: "Correo Electrónico", accessor: "email" },
        { header: "Tipo de Usuario", accessor: "roles" },
        isAdmin && {
          header: "Acciones",
          render: (row) => (
            <div className="user-management-table-actions">
              <Button
                type="secondary"
                onClick={() => handleEditUser(row)}
                disabled={currentUser?.id === row.id} 
              >
                <FaEdit />
              </Button>
              <Button
                type="danger"
                onClick={() => confirmDeleteUser(row)}
                disabled={currentUser?.id === row.id} 
              >
                <MdDelete />
              </Button>
            </div>
          ),
        },
      ].filter(Boolean),
    [isAdmin, handleEditUser, confirmDeleteUser, currentUser]
  );

  return (
    <div className="user-management-container">
      <Toaster 
        dir="auto"
        closeButton
        richColors
        visibleToasts={2}
        duration={2000}
        position="bottom-right" /> 
      <div className="user-management-header">
        <h2 className="user-management-title">Gestión de Usuarios</h2>
      <SearchBar value={filterText} onChange={(e) => setFilterText(e.target.value)} />

        {isAdmin && (
          <Button type="primary" onClick={handleAddUser}>
            Agregar Usuario
          </Button>
        )}
        
      </div>
      <Table columns={columns} data={filteredUsers} className="user-management-table" />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</h2>
        <UserForm
          initialValues={{
            name: editingUser?.name || "",
            last_name: editingUser?.last_name || "",
            username: editingUser?.username || "",
            email: editingUser?.email || "",
            password: "",
            confirmPassword: "",
            role: editingUser?.role || "",
          }}
          onSubmit={handleSubmit}
          roles={memoizedRoles}
          editingUser={editingUser}
        />
        {serverError && <p className="error-message">{serverError}</p>}
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este usuario?</p>
        <div className="user-management-table-actions">
          <Button type="danger" onClick={handleDeleteUser}>
            Confirmar
          </Button>
          <Button type="secondary" onClick={() => setDeleteConfirmOpen(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
