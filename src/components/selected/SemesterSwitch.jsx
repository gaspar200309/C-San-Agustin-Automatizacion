import React, { useState } from 'react';

const SemesterSwitch = ({ onChange }) => {
  const [isTrimestre, setIsTrimestre] = useState(true);

  const handleChange = (e) => {
    const value = e.target.value === 'trimestre';
    setIsTrimestre(value);
    onChange(value);
  };

  return (
    <div className="semester-switch">
      <label>
        <input
          type="radio"
          value="trimestre"
          checked={isTrimestre}
          onChange={handleChange}
        />
        Trimestre
      </label>
      <label>
        <input
          type="radio"
          value="periodo"
          checked={!isTrimestre}
          onChange={handleChange}
        />
        Periodo
      </label>
    </div>
  );
};

export default SemesterSwitch;
