import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputText from '../../components/inputs/InputText';
import Select from '../../components/selected/Select';
import { Button } from '../../components/buttons/Button';

function UserForm({ initialValues, onSubmit, roles, editingUser }) {

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        name: Yup.string().required('Requerido'),
        last_name: Yup.string().required('Requerido'),
        username: Yup.string().required('Requerido'),
        email: Yup.string().email('Correo inválido').required('Requerido'),
        password: Yup.string()
          .min(6, 'Mínimo 6 caracteres')
          .when('editingUser', {
            is: false,
            then: Yup.string().required('Requerido'),
          }),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
          .when('editingUser', {
            is: false,
            then: Yup.string().required('Requerido'),
          }),
        role: Yup.string()
          .when('editingUser', {
            is: false,
            then: Yup.string().nullable().required("Requerido"),
          }),
      })}
      onSubmit={onSubmit}
    >
      <Form className="form">
        <InputText label="Nombre" name="name" required />
        <InputText label="Apellido" name="last_name" required />
        <InputText label="Usuario" name="username" required />
        <InputText label="Correo Electrónico" name="email" required />
        <InputText
          label="Contraseña"
          name="password"
          type="password"
          required={!editingUser}   
        />
        <InputText
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          required={!editingUser} 
        />
        <Select label="Roles" name="role" required = {!editingUser}>
          <option value="">Seleccione un tipo de usuario</option>
          {roles.map((rol) => (
            <option key={rol.value} value={rol.value}>
              {rol.label}
            </option>
          ))}
        </Select>
        <Button variant="primary" type="submit">
          Guardar
        </Button>
      </Form>
    </Formik>
  );
}

export default UserForm;
