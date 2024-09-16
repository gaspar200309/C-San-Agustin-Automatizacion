import React from "react";
import { Formik, Form} from "formik";
import Select from "../../selected/Select";
import InputText from "../../inputs/InputText";
import { Button } from "../../buttons/Button";
import { getCourses, registerCommunications } from "../../../api/api";
import useFetchData from "../../../hooks/useFetchData";
import CourseSelect from "../../selected/CourseSelect";
import TrimestreSelect from "../../selected/TrimestreSelect";

const CommunicationsForm = () => {

  return (
    <Formik
      initialValues={{ course: '', communications: '' }}
      onSubmit={(values) => registerCommunications(values)}
    >
      {() => (
        <Form>
          <CourseSelect label="Cursos" name="course" required/>
          <TrimestreSelect label="Trimestre" name="trimestre" required/>
          <InputText name="communications" label="Cantidad de Comunicados" required  />
          <Button type="submit">Registrar Comunicados</Button>
        </Form>
      )}
    </Formik>
  );
};

export default CommunicationsForm;
