import React from 'react';
import Select from '../../components/selected/Select';

const StatusSelect = ({ label, name, value, onChange }) => {
  return (
    <Select
      label={label}
      name={name}
      required={true}
      value={value}
      onChange={onChange}
    >
      <option value="">Seleccione Estado</option>
      <option value="Sí">Sí</option>
      <option value="No">No</option>
      <option value="Retraso">Retraso</option>
      <option value="Incompleto">Incompleto</option>
      <option value="No corresponde">No corresponde</option>
    </Select>
  );
};

export default StatusSelect;
