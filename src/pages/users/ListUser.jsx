import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { Button } from "../../components/buttons/Button";
import Table from "../../components/table/Table";
import SearchBar from "../../components/searchBar/SearchBar";
import { FaEdit, MdDelete } from "../../hooks/icons";
import { getUsers, deleteUser, getRoles } from "../../api/api";
import { getUser } from "../login/authFunctions";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import LinkButton from "../../components/buttons/LinkButton";
import "./ListUser.css";

// Carga perezosa del componente Modal para mejorar el rendimiento
const Modal = lazy(() => import("../../components/modal/Modal"));

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [filterValues, setFilterValues] = useState({});
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

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      setUsers(response.data);
    };
    fetchUsers();
  }, []);


  const handleDeleteUser = useCallback(async () => {
    if (userToDelete.id === currentUser.id) {
      toast.error("No puedes eliminar tu propio usuario.");
      return;
    }
    try {
      await deleteUser(userToDelete.id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
      toast.success("Usuario eliminado exitosamente.");
    } catch (error) {
      toast.error("Error al eliminar el usuario.");
    } finally {
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  }, [userToDelete, currentUser]);

  const confirmDeleteUser = useCallback(
    (user) => {
      if (user.id === currentUser.id) {
        toast.error("No puedes eliminar tu propio usuario.");
        return;
      }
      setUserToDelete(user);
      setDeleteConfirmOpen(true);
    },
    [currentUser]
  );


  // Filtering users based on text and filter values
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        (!filterText ||
          user.name?.toLowerCase().includes(filterText.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(filterText.toLowerCase()) ||
          user.username?.toLowerCase().includes(filterText.toLowerCase()) ||
          user.email?.toLowerCase().includes(filterText.toLowerCase()) ||
          user.role?.toLowerCase().includes(filterText.toLowerCase())) &&
        Object.keys(filterValues).every((key) =>
          filterValues[key]
            ? user[key]?.toString().toLowerCase() === filterValues[key].toString().toLowerCase()
            : true
        )
      );
    });
  }, [users, filterText, filterValues]);

  const isAdmin = useMemo(
    () => currentUser?.roles.includes("Administrador"),
    [currentUser]
  );

  // Memoizing column definitions to avoid unnecessary re-renders
  const columns = useMemo(
    () => [
      { header: "ID", accessor: "id" },
      {
        header: "",
        accessor: "photo",
        render: (row) => (
          <div className="user-photo">
            <img
              src={row.photo || "ruta/de/foto/por/defecto.jpg"}
              alt={`${row.name} ${row.last_name}`}
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          </div>
        ),
      },
      { header: "Nombre", accessor: "name" },
      { header: "Apellido", accessor: "last_name" },
      { header: "Teléfono", accessor: "phone" },
      { header: "Correo Electrónico", accessor: "email" },
      { header: "Tipo de Usuario", accessor: "roles" },
      isAdmin && {
        header: "Acciones",
        render: (row) => (
          <div className="user-management-table-actions">
            <Link to={`/editUser/${row.id}`} className="user-management-edit-user">
              <FaEdit />
            </Link>
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
    [isAdmin, confirmDeleteUser, currentUser]
  );

  return (
    <div className="user-management-container">
      <Toaster dir="auto" closeButton richColors visibleToasts={2} duration={2000} position="bottom-right" />
      <div className="user-management-header">
        <h2 className="user-management-title">Gestión de Usuarios</h2>
        <SearchBar value={filterText} onChange={(e) => setFilterText(e.target.value)} />
        {isAdmin && <LinkButton to={`/registerUser`}>Agregar Usuario</LinkButton>}
      </div>

      <Table columns={columns} data={filteredUsers} className="user-management-table" />

      <Suspense fallback={<div>Cargando modal...</div>}>
        {deleteConfirmOpen && (
          <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}>
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
        )}
      </Suspense>
    </div>
  );
};

export default UserManagement;

