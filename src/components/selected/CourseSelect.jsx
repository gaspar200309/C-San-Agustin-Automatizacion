import React, { useMemo } from 'react';
import useFetchData from '../../hooks/useFetchData';
import Select from '../selected/Select';
import { getCourses } from '../../api/api';

const CourseSelect = ({ name, label, ...props }) => {
  const { data: courses, error, loading } = useFetchData(getCourses);

  const uniqueCourses = useMemo(() => {
    return [
      ...new Map(courses.map((item) => [item.course_id, item])).values(),
    ];
  }, [courses]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
