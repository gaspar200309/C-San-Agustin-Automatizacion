import React, { useMemo } from 'react';
import Select from '../selected/Select';

const TrimestreSelect = ({ name, label, ...props }) => {

    const Trimestres = [
        { id: 1, name: "Primer Trimestre" },
        { id: 2, name: "Segundo Trimestre" },
        { id: 3, name: "Tercer Trimestre" },
        { id: 4, name: "Cuarto Trimestre" },
    ];

  return (
    <Select label={label} name={name} {...props}>
      <option value="">Seleccione un trimestre</option>
      {Trimestres.map((trimestre) => (
        <option key={trimestre.id} value={trimestre.id}>
          {`${trimestre.name}`}
        </option>
      ))}
    </Select>
  );
};

export default TrimestreSelect;
