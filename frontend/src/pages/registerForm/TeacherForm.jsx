import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import './TeacherForm.css';
import { registerTeacher } from '../../api/api';

const TeacherForm = () => {
  const initialValues = {
    name: '',
    last_name: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    lastName: Yup.string().required('Last Name is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await registerTeacher(values);
      console.log('Teacher registered successfully');
      resetForm();
    } catch (error) {
      console.error('Error registering teacher:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="teacher-form">
          <h2>Register Profesores</h2>
          <InputText
            label="Nombre"
            name="name"
            type="text"
            required
            placeholder="Enter teacher's name"
          />
          <InputText
            label="Apellidos"
            name="last_name"
            type="text"
            required
            placeholder="Enter teacher's last name"
          />
          <button type="submit" disabled={isSubmitting}>
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default TeacherForm;
