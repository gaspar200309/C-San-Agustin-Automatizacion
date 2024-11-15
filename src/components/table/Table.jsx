import './Table.css';

const Table = ({ columns, data, onRowClick }) => {
  // Check if any column has subcolumns
  const hasSubColumns = columns.some(column => column.columns);

  return (
    <table className="reusable-table">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} colSpan={column.columns ? column.columns.length : 1}>
              {column.header}
            </th>
          ))}
        </tr>
        {hasSubColumns && (
          <tr>
            {columns.map((column, index) =>
              column.columns ? (
                column.columns.map((subColumn, subIndex) => (
                  <th key={`${index}-${subIndex}`}>{subColumn.header}</th>
                ))
              ) : (
                <th key={index}>{column.header}</th>
              )
            )}
          </tr>
        )}
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row)}>
            {columns.map((column, colIndex) => {
              // Render subcolumns if present, otherwise render the main column
              if (column.columns) {
                return column.columns.map((subColumn, subIndex) => (
                  <td key={`${colIndex}-${subIndex}`}>
                    {row[subColumn.accessor] || '-'}
                  </td>
                ));
              } else {
                // Check if the column has a custom render function
                return (
                  <td key={colIndex}>
                    {column.render ? column.render(row) : row[column.accessor] || '-'}
                  </td>
                );
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
