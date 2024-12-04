import React, { useState, useEffect } from "react";
import { getCoursesByTeacher } from "../../api/api";
import styles from "./CoursesByTeacherInputs.module.css";

const CoursesByTeacherInputs = ({ teacherId, onChange }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!teacherId) {
        setCourses([]);
        setLoading(false);
        return;
      }

      try {
        const response = await getCoursesByTeacher(teacherId);
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  if (loading) return <p className={styles.message}>Cargando cursos...</p>;

  if (courses.length === 0)
    return <p className={styles.message}>No hay cursos disponibles para este profesor.</p>;

  return (
    <div className={styles.coursesInputs}>
      {courses.map((course) => (
        <div key={course.id} className={styles.courseRow}>
          <label htmlFor={`course-${course.id}`} className={styles.courseLabel}>
            {`${course.nivel.name} - ${course.name}`}
          </label>
          <input
            id={`course-${course.id}`}
            name={`course-${course.id}`}
            type="number"
            maxLength={3}
            className={styles.courseInput}
            placeholder="0"
            onChange={(e) => onChange(course.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default CoursesByTeacherInputs;
