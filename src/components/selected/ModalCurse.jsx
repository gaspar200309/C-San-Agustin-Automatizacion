import React, { useState, useMemo } from 'react';
import Modal from '../modal/Modal';
import { Button } from '../buttons/Button';
import { useCourseContext } from '../../context/CourseProvider';
import { useTheme } from '../../context/ThemeContext';
import './ModalCourse.css';

const CourseModal = ({ name, label, onChange, selectedCourses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState(selectedCourses || []);
  const { courses, loading, error } = useCourseContext();
  console.log(courses);
  const { theme } = useTheme();

  const uniqueCourses = useMemo(() => {
    if (!courses) return [];
    return [...new Map(courses.map((item) => [item.course_id, item])).values()];
  }, [courses]);  

  const toggleCourseSelection = (course_id) => {
    if (selectedCourseIds.includes(course_id)) {
      setSelectedCourseIds(selectedCourseIds.filter((id) => id !== course_id));
    } else {
      setSelectedCourseIds([...selectedCourseIds, course_id]);
    }
  };

  const handleSave = () => {
    onChange(selectedCourseIds);
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!courses || courses.length === 0) return <p>No courses available</p>;

  return (
    <div>
      <Button type="button" onClick={() => setIsModalOpen(true)} className={theme}>
        {selectedCourseIds.length > 0
          ? `${selectedCourseIds.length} curso(s) seleccionados`
          : 'Seleccione cursos'}
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className={theme}>
        <h3>{label}</h3>
        <ul>
          {uniqueCourses.map((course) => (
            <li key={course.course_id} className={`custom-checkbox ${theme}`}>
              <input
                id={`checkbox-${course.course_id}`}
                type="checkbox"
                value={course.course_id}
                checked={selectedCourseIds.includes(course.course_id)}
                onChange={() => toggleCourseSelection(course.course_id)}
              />
              <label htmlFor={`checkbox-${course.course_id}`}>
                {`${course.nivel} - ${course.course_name}`}
              </label>
            </li>
          ))}
        </ul>

        <Button type="button" onClick={handleSave}>
          Guardar selección
        </Button>
      </Modal>
    </div>
  );
};

export default CourseModal;
