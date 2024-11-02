import React from 'react';

const SemesterSwitch = ({ isTrimestre, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value === 'trimestre');
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
