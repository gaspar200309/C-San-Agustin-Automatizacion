import React from "react";
import { Formik, Form, Field } from "formik";
import Select from "../../selected/Select";
import InputText from "../../inputs/InputText";
import { Button } from "../../buttons/Button";
import { registerYearlyCommunications } from "../../../api/api";
import useFetchData from "../../../hooks/useFetchData";

const YearlyCommunicationsForm = () => {
  return (
    <Formik
      initialValues={{ year: '', communications: '' }}
      onSubmit={(values) => registerYearlyCommunications(values)}
    >
      {() => (
        <Form>
          <InputText name="year" label="Año" required/>
          <InputText name="communications" label="Cantidad de Comunicados" required  />
          <Button type="submit">Registrar Comunicados</Button>
        </Form>
      )}
    </Formik>
  );
};

export default YearlyCommunicationsForm;
