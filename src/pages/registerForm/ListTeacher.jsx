import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import { Toaster, toast } from "sonner";
import { Button } from "../../components/buttons/Button";
import { deleteTeacher } from "../../api/api"; 
import { getUser } from "../login/authFunctions";
import { MdDelete } from "react-icons/md";
import { useTeacherContext } from "../../context/TeacherProvider";
import Table from "../../components/table/Table";

export default function ListTeacher() {
  const { teachers, loading, error, fetchTeachers } = useTeacherContext();
  const currentUser = useMemo(() => getUser(), []);
  console.log(currentUser);
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
          fetchTeachers(); // Recargar la lista después de eliminar
        })
        .catch((error) => {
          toast.error(`Error al eliminar el profesor: ${error.message}`);
        });
    }
  }, [currentUser, fetchTeachers]);

  // Llamar fetchTeachers al montar el componente
  useEffect(() => {
    if (teachers.length === 0) {
      fetchTeachers();
    }
  }, [teachers, fetchTeachers]);
  

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando los datos.</p>;

  return (
    <>
      <Toaster />
      {isAdmin && (
        <Button type="primary" onClick={() => navigate("/registerTeacher")}>
          Agregar profesor
        </Button>
      )}
      <Table columns={columns} data={teachers} />
    </>
  );
}
