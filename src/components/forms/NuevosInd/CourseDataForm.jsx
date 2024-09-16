import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Select from '../../selected/Select';
import InputText from '../../inputs/InputText';
import { Button } from '../../buttons/Button';
import { getCourses, registerCourseData } from '../../../api/api';
import useFetchData from '../../../hooks/useFetchData';
import CourseSelect from '../../selected/CourseSelect';
import PeriodoSelect from '../../selected/PeriodoSelect';
import TeacherSelector from '../../selected/TeacherSelector';
import SemesterSwitch from '../../selected/SemesterSwitch';
import TrimestreSelect from '../../selected/TrimestreSelect';
import StatusSelect from '../../selected/StatusSelect';

const CourseDataForm = () => {
  const { data: courses } = useFetchData(getCourses);
  const [isTrimestre, setIsTrimestre] = useState(true);

  return (
    <Formik
      initialValues={{ course: '', value: '', periodo: '', teacher: '' }}
      onSubmit={(values) => registerCourseData(values)}
    >
      {() => (
        <Form>
          <CourseSelect label="Cursos" name="course" required />
          <SemesterSwitch onChange={setIsTrimestre} />
          {isTrimestre ? (
            <TrimestreSelect label="Periodo" name="periodo" required />
          ) : (
            <PeriodoSelect label="Seleccionar Periodo" name="periodo" required/>
          )}
          <TeacherSelector label="Profesor" name="teacher" required />
          <StatusSelect
            label="Estado"
            name="status"
            required
            />
          <Button type="submit">Registrar Cifra</Button>
        </Form>
      )}
    </Formik>
  );
};

export default CourseDataForm;
