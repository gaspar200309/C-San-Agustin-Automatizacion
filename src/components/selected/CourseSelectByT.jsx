import { useEffect, useState } from 'react';
import Select from '../selected/Select';
import { getCoursesByTeacher } from '../../api/api';

const CourseSelectByTeacher = ({ name, label, teacherId, ...props }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!teacherId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getCoursesByTeacher(teacherId);

        const coursesData = response.data.courses;

        if (Array.isArray(coursesData)) {
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!courses || courses.length === 0) return <p>No courses available</p>;

  return (
    <Select label={label} name={name} {...props}>
      <option value="">Seleccione un curso</option>
      {courses.map((course) => (
        <option key={course.id} value={course.id}>
          {`${course.nivel.name} - ${course.name}`}
        </option>
      ))}
    </Select>
  );
};

export default CourseSelectByTeacher;
