import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { getIndicator } from '../../api/api';
import useFetchData from '../../hooks/useFetchData';
import ColumnToggle from '../../components/table/ColumnToggle';
import Table from '../../components/table/Table';


const LinkButton = lazy(() => import('../../components/buttons/LinkButton'));

const IndicatorsList = () => {
  const { data: indicators, loading: loadingIndicator, error: errorIndicator } = useFetchData(getIndicator);
  const [columnsState, setColumnsState] = useState([
    { id: 'name', header: 'Nombre', accessor: 'name', isHidden: false },
    { id: 'due_date', header: 'Fecha de Vencimiento', accessor: 'due_date', isHidden: false },
    { id: 'expected_result', header: 'Resultado Esperado', accessor: 'expected_result', isHidden: false },
    { id: 'academic_objective', header: 'Objetivo Académico', accessor: 'academic_objective', isHidden: false },
    { id: 'sgc_objective', header: 'Objetivo SGC', accessor: 'sgc_objective', isHidden: false },
    { id: 'formula', header: 'Fórmula', accessor: 'formula', isHidden: false }
  ]);

  const [showColumnToggle, setShowColumnToggle] = useState(false);



  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    allColumns,
    state,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      globalFilter: (rows, columnIds, filterValue) => {
        const { column, value } = filterValue;
        return rows.filter(row => {
          const rowValue = row.values[column];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().includes(String(value).toLowerCase())
            : true;
        });
      },
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const filteredIndicators = useMemo(() => {
    if (!globalFilter.value) return indicators;
    return indicators.filter((indicator) =>
      indicator[globalFilter.column]
        ?.toString()
        .toLowerCase()
        .includes(globalFilter.value.toLowerCase())
    );
  }, [globalFilter, indicators]);

  // useCallback para memorizar el cambio en el filtro
  const handleFilterChange = useCallback((e) => {
    setGlobalFilter((prevFilter) => ({ ...prevFilter, value: e.target.value }));
  }, []);

  const handleColumnChange = useCallback((e) => {
    setGlobalFilter((prevFilter) => ({ ...prevFilter, column: e.target.value }));
  }, []);

  // Filter columns to show/hide
  const visibleColumns = useMemo(() => columnsState.filter(column => !column.isHidden), [columnsState]);

  if (loadingIndicator) return <p>Cargando...</p>;
  if (errorIndicator) return <p>Error cargando los Indicadores.</p>;

  return (
    <div>
      <h1>Lista de Indicadores</h1>

      <Suspense fallback={<p>Cargando botón...</p>}>
        <LinkButton to="registerIndicator" className="indicador-button">
          Registrar indicador
        </LinkButton>
      </Suspense>

    {showColumnToggle  && <ColumnToggle allColumns={columnsState} />}
      

      <div>
        <label htmlFor="column">Filtrar por columna:</label>
        <select id="column" value={globalFilter.column} onChange={handleColumnChange}>
          <option value="">Seleccione columna</option>
          {columnsState.map(column => (
            <option key={column.id} value={column.accessor}>
              {column.header}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter.value}
          onChange={handleFilterChange}
        />
      </div>

      <Table 
        columns={visibleColumns} 
        data={filteredIndicators} 
        onRowClick={(row) => console.log('Row clicked:', row)} 
      />
    </div>
  );
};

export default IndicatorsList;
