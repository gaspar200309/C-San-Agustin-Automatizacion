import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import Table from "../../components/table/Table";
import { Toaster, toast } from "sonner";
import useFetchData from "../../hooks/useFetchData";
import { Button } from "../../components/buttons/Button";
import { getTeacher, deleteTeacher } from "../../api/api"; 
import { getUser } from "../login/authFunctions";
import { MdDelete } from "react-icons/md";

export default function ListTeacher() {
  const { data: teachers, loading: loadingTeacher, error: errorTeacher } = useFetchData(getTeacher);
  console.log(teachers)
  const currentUser = useMemo(() => getUser(), []);
  const isAdmin = useMemo(() => currentUser?.roles.includes("Administrador"), [currentUser]);
  const navigate = useNavigate(); 

  const columns = useMemo(() => [
    { header: "Nombre", accessor: "name" },
    { header: "Apellido", accessor: "last_name" },
    { header: "Asignatura", accessor: "asignatura" },
    { header: "Curso", accessor: "courses.course_name" },
    isAdmin && {
      header: "Acciones",
      render: (row) => (
        <div className="user-management-table-actions">
          <Button
            type="secondary"
            onClick={() => navigate(`/updateTeacher/${row.id}`)} 
            disabled={currentUser?.id === row.id}
          >
            Editar
          </Button>
          <Button
            type="danger"
            onClick={() => confirmDeleteTeacher(row)}
            disabled={currentUser?.id === row.id}
          >
            <MdDelete />
          </Button>
        </div>
      ),
    },
  ].filter(Boolean), [isAdmin, currentUser]);

  const confirmDeleteTeacher = useCallback((teacher) => {
    if (teacher.id === currentUser.id) {
      toast.error('No puedes eliminar tu propio usuario.');
      return;
    }
  
    const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar al profesor ${teacher.name}?`);
    if (confirmed) {
      deleteTeacher(teacher.id)
        .then(() => {
          toast.success('Profesor eliminado exitosamente');
        })
        .catch((error) => {
          toast.error(`Error al eliminar el profesor: ${error.message}`);
        });
    }
  }, [currentUser]);
  

  if (loadingTeacher) return <p>Cargando...</p>;
  if (errorTeacher) return <p>Error cargando los datos.</p>;

  return (
    <>
      <Toaster />
      {isAdmin && (
        <Button type="primary" onClick={() => navigate("/registerTeacher")}>  {/* Navegar a la página de registro */}
          Agregar profesor
        </Button>
      )}
      <Table columns={columns} data={teachers} />
    </>
  );
}
