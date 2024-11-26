import React, { useMemo } from 'react';
import Select from '../selected/Select';
import { useCourseContext } from '../../context/CourseProvider';

const CourseSelect = ({ name, label, ...props }) => {
  const { courses, error, loading } = useCourseContext();

  const uniqueCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    return [...new Map(courses.map((item) => [item.course_id, item])).values()];
  }, [courses]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!uniqueCourses.length) return <p>No courses available</p>;

  return (
    <Select label={label} name={name} {...props}>
      <option value="">Seleccione un curso</option>
      {uniqueCourses.map((course) => (
        <option key={course.course_id} value={course.course_id}>
          {`${course.nivel} - ${course.course_name}`}
        </option>
      ))}
    </Select>
  );
};

export default CourseSelect;
