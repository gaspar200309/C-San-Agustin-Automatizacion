import React from "react";
import { useMemo } from "react";
import { Formik, Form } from "formik";
import Select from "../../selected/Select";
import InputText from "../../inputs/InputText";
import { Button } from "../../buttons/Button";
import { registerAttendance } from "../../../api/api";
import useFetchData from "../../../hooks/useFetchData";
import CourseSelect from "../../selected/CourseSelect";
import useSubmitData from "../../../hooks/useFetchData";

const AttendanceForm = () => {
  const { loading, error, success, submitData } = useSubmitData(registerAttendance);

  

  return (
    <Formik
      initialValues={{ totalClasses: '', missedClasses: '' }}
      onSubmit={(values) => {
        const attendancePercentage = ((values.totalClasses - values.missedClasses) / values.totalClasses) * 100;
        submitData({ ...values, attendancePercentage });
      }}
    >
      {() => (
        <Form>
          <CourseSelect name="course" label="Cursos" required />
          <InputText name="totalClasses" label="Total por Curso" required  />
          <InputText name="missedClasses" label="Cantidad de licencias" required  />
          <Button type="submit">Registrar Asistencia</Button>
        </Form>
      )}
    </Formik>
  );
};

export default AttendanceForm;
