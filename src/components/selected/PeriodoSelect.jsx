import React, { useMemo } from 'react';
import Select from '../selected/Select';

const PeriodoSelect = ({ name, label, ...props }) => {

    const Periodos = [
        { id: 1, name: "Primer Periodo" },
        { id: 2, name: "Segundo Periodo" },
        { id: 3, name: "Tercer Periodo" },
        { id: 4, name: "Cuarto Periodo" },
        { id: 5, name: "Quinto Periodo" },
        { id: 6, name: "Sexto Periodo" },
    ];

  return (
    <Select label={label} name={name} {...props}>
      <option value="">Seleccione un periodo</option>
      {Periodos.map((periodo) => (
        <option key={periodo.id} value={periodo.id}>
          {`${periodo.name}`}
        </option>
      ))}
    </Select>
  );
};

export default PeriodoSelect;
