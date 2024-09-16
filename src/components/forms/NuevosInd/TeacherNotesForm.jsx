import React from "react";
import { Formik, Form, Field } from "formik";
import Select from "../../selected/Select";
import { Button } from "../../buttons/Button";
import { getTeacher, getPeriods, registerTeacherNotes } from "../../../api/api";
import useFetchData from "../../../hooks/useFetchData";
import TrimestreSelect from "../../selected/TrimestreSelect";
import CourseDataForm from "./CourseDataForm";
import CourseSelect from "../../selected/CourseSelect";
import InputText from "../../inputs/InputText";

const TeacherNotesForm = () => {
  const { data: teachers } = useFetchData(getTeacher);
  const { data: periods } = useFetchData(getPeriods);

  return (
    <Formik
      initialValues={{ teacher: '', period: '', notesUploaded: false }}
      onSubmit={(values) => registerTeacherNotes(values)}
    >
      {() => (
        <Form>
          <CourseSelect label="Cursos" name="course" required/>
          <TrimestreSelect label="Trimestre" name="trimestre" required/>
          <InputText label="Cantidad de comunicados" name = "contidad" required />
          <Button type="submit">Registrar Comunicados</Button>
        </Form>
      )}
    </Formik>
  );
};

export default TeacherNotesForm;
