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
      <option value="1">Sí</option>
      <option value="2">No</option>
      <option value="3">Retraso</option>
      <option value="4">Incompleto</option>
      <option value="5">No corresponde</option>
    </Select>
  );
};

export default StatusSelect;
