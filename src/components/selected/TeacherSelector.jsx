import { useEffect, useMemo } from "react";
import Select from "../../components/selected/Select";
import { useTeacherContext } from "../../context/TeacherProvider";

const TeacherSelector = ({ onChange, value, name, label, required }) => {
  const { teachers, fetchTeachers, loading } = useTeacherContext();

  // Cargar profesores si no están disponibles
  useEffect(() => {
    if (teachers.length === 0) {
      fetchTeachers();
    }
  }, [teachers, fetchTeachers]);

  // Formatear opciones para el selector
  const teacherOptions = useMemo(() => {
    return teachers.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.name} ${teacher.last_name}`,
      key: teacher.id,
    }));
  }, [teachers]);

  return (
    <Select
      label={label || "Profesor"}
      name={name || "profesor"}
      required={required}
      value={value}
      onChange={onChange}
      disabled={loading} // Desactivar mientras carga
    >
      <option value="">Seleccione Profesor</option>
      {teacherOptions.map((teacher) => (
        <option key={teacher.key} value={teacher.value}>
          {teacher.label}
        </option>
      ))}
    </Select>
  );
};

export default TeacherSelector;
