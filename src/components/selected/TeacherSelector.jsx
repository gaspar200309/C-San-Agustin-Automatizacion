import { useState, useEffect } from 'react';
import Select from '../../components/selected/Select';
import { getTeacher } from '../../api/api';

const TeacherSelector = ({ onChange, value, name, label, required }) => {
  const [teacherOptions, setTeacherOptions] = useState([]);

  useEffect(() => {
    getTeacher().then(response => {
      setTeacherOptions(response.data.map(teacher => ({
        value: teacher.id,
        label: `${teacher.name} ${teacher.last_name}`,
        key: teacher.id, 
      })));
    });
  }, []);
  
  return (
    <Select
      label={label || "Profesor"}
      name={name || "profesor"}
      required={required}
      value={value}
      onChange={onChange}
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