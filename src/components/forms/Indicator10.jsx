import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputText from "../inputs/InputText";
import { Button } from "../buttons/Button";
import { registerStatusIndicador10, getStatusIndicator10 } from '../../api/api'; // Importar las funciones

// Validación con Yup
const validationSchema = Yup.object({
  activeAccounts: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
  inactiveAccounts: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
});

const Indicator10 = () => {
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [activePercentage, setActivePercentage] = useState(0);
  const [inactivePercentage, setInactivePercentage] = useState(0);
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStatusIndicator10(10); 
        const data = response.data;
        console.log(data)
        setStatusData(data);  
        const total = data.active_students + data.inactive_students;
        setTotalAccounts(total);
        setActivePercentage(((data.active_students / total) * 100).toFixed(2));
        setInactivePercentage(((data.inactive_students / total) * 100).toFixed(2));
      } catch (error) {
        console.error('Error al obtener los datos del indicador 10', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    const { activeAccounts, inactiveAccounts } = values;
    const total = activeAccounts + inactiveAccounts;

    const activePercentage = total > 0 ? ((activeAccounts / total) * 100).toFixed(2) : 0;
    const inactivePercentage = total > 0 ? ((inactiveAccounts / total) * 100).toFixed(2) : 0;

    setTotalAccounts(total);
    setActivePercentage(activePercentage);
    setInactivePercentage(inactivePercentage);

    try {
      const response = await registerStatusIndicador10({
        active_students: activeAccounts,
        inactive_students: inactiveAccounts,
        indicator_id: 10,
      });
      console.log('Datos registrados:', response.data);
      setStatusData(response.data);
    } catch (error) {
      console.error('Error al registrar los datos', error);
    }
  };

  return (
    <div className="indicator10-container">
      <h2>Indicator 10: Active Accounts Report</h2>
      <Formik
        initialValues={{ activeAccounts: '', inactiveAccounts: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className="form">
            <div className="form-group">
              <InputText
                id="activeAccounts"
                name="activeAccounts"
                label={"Cantidad activos"}
                type="number"
                value={values.activeAccounts}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <InputText
                id="inactiveAccounts"
                name="inactiveAccounts"
                label="Cantidad inactivos"
                type="number"
                value={values.inactiveAccounts}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit">Registrar</Button>
          </Form>
        )}
      </Formik>

      {/* Mostrar los resultados */}
      {statusData && (
        <div className="results">
          <p>Total estudiantes: {totalAccounts}</p>
          <p>Porcentaje de activos: {activePercentage}%</p>
          <p>Porcentaje de inactivos: {inactivePercentage}%</p>
        </div>
      )}
    </div>
  );
};

export default Indicator10;
