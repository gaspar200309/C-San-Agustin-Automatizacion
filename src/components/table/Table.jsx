import React from 'react';
import './Table.css';

const Table = ({ columns, data, onRowClick }) => {
  console.log('Table received columns:', columns);
  console.log('Table received data:', data);

  return (
    <table className="reusable-table">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row)}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>
                {column.render ? column.render(row) : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;