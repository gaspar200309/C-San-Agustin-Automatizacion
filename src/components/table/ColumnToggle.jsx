import React, { useEffect, useState } from 'react';
import Switch from '../selected/Switch';
import './ColumnToggle.css';

const ColumnToggle = ({ allColumns }) => {
  const [filterValues, setFilterValues] = useState('');
  const [columnsState, setColumnsState] = useState([]);

  useEffect(() => {
    if (allColumns && Array.isArray(allColumns)) {
      setColumnsState(allColumns.map(column => ({
        id: column.id,
        Header: column.Header,
        isHidden: column.isHidden,
      })));
    }
  }, [allColumns]);

  const handleFilterChange = (e) => {
    setFilterValues(e.target.value);
  };

  const toggleAllColumns = (shouldShow) => {
    const updatedColumns = columnsState.map(column => ({
      ...column,
      isHidden: !shouldShow,
    }));
    setColumnsState(updatedColumns);
    allColumns.forEach(column => column.toggleHidden(!shouldShow));
  };

  const toggleColumn = (id) => {
    const updatedColumns = columnsState.map(column =>
      column.id === id ? { ...column, isHidden: !column.isHidden } : column
    );
    setColumnsState(updatedColumns);

    const column = allColumns.find(col => col.id === id);
    if (column) {
      column.toggleHidden(column.isHidden);
    }
  };

  // Ensure that column.Header is defined before calling toString()
  const filteredColumns = columnsState.filter(column =>
    column.Header?.toString().toLowerCase().includes(filterValues.toLowerCase())
  );

  return (
    <div className="column-toggle">
      <div className="toggle-controls">
        <input
          type="text"
          placeholder="Buscar columnas..."
          value={filterValues}
          onChange={handleFilterChange}
        />
        <button onClick={() => toggleAllColumns(true)}>Mostrar Todo</button>
        <button onClick={() => toggleAllColumns(false)}>Ocultar Todo</button>
      </div>
      <div className="column-toggle-list">
        {filteredColumns.map(column => (
          <div key={column.id} className="column-toggle-item">
            <Switch
              onChange={() => toggleColumn(column.id)}
              checked={!column.isHidden}
              rounded={true}
            />
            <label>{column.Header}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnToggle;
