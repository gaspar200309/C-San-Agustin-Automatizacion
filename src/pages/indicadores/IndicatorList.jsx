import React, { useMemo, useState, lazy, Suspense } from 'react';
import { getIndicator } from '../../api/api';
import useFetchData from '../../hooks/useFetchData';
import Table from '../../components/table/Table';
import ColumnToggle from '../../components/table/ColumnToggle';
import Modal from '../../components/modal/Modal'; 
import './ListIndicadores.css'; 

const LinkButton = lazy(() => import('../../components/buttons/LinkButton'));

const IndicatorsList = () => {
  const { data: indicators, loading: loadingIndicator, error: errorIndicator } = useFetchData(getIndicator);
  const [columnsState, setColumnsState] = useState([
    { id: 'id', header: "ID", accessor: 'id', isHidden: false },
    { id: 'name', header: 'Nombre', accessor: 'name', isHidden: false },
    { id: 'due_date', header: 'Fecha de Vencimiento', accessor: 'due_date', isHidden: false },
    { id: 'expected_result', header: 'Resultado Esperado', accessor: 'expected_result', isHidden: false },
    { id: 'academic_objective', header: 'Objetivo Académico', accessor: 'academic_objective', isHidden: false },
    { id: 'sgc_objective', header: 'Objetivo SGC', accessor: 'sgc_objective', isHidden: false },
    { id: 'formula', header: 'Fórmula', accessor: 'formula', isHidden: false },
    { id: 'actions', header: 'Acciones', accessor: 'actions', isHidden: false }, // Add actions column
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  if (loadingIndicator) return <p>Cargando...</p>;
  if (errorIndicator) return <p>Error cargando los Indicadores.</p>;

  const visibleColumns = columnsState.filter(column => !column.isHidden);

  const handleColumnChange = (updatedColumns) => {
    setColumnsState(updatedColumns);
  };

  const handleRegisterClick = (indicatorId) => {
    console.log('Register indicator:', indicatorId);
  };

  const columnsWithActions = visibleColumns.map(col => 
    col.id === 'actions' ? 
      { 
        ...col, 
        Cell: ({ row }) => (
          <button onClick={() => handleRegisterClick(row.original.id)}>Registrar</button>
        ) 
      } 
      : col
  );

  return (
    <div>
      <h1>Lista de Indicadores</h1>

      <div className="button-container">
        <Suspense fallback={<p>Cargando botón...</p>}>
          <LinkButton to="registerIndicator" className="indicador-button">
            Registrar indicador
          </LinkButton>
        </Suspense>
        <Suspense fallback={<p>Cargando botón...</p>}>
          <LinkButton to="asignerCordinator" className="indicador-button">
            Asignar Coordinador
          </LinkButton>
        </Suspense>
      </div>

      <button onClick={() => setIsModalOpen(true)}>Mostrar/Ocultar Columnas</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Seleccionar Columnas</h2>
        <ColumnToggle allColumns={columnsState} onColumnChange={handleColumnChange} />
      </Modal>

      <Table 
        columns={columnsWithActions} 
        data={indicators} 
        onRowClick={(row) => console.log('Row clicked:', row)} 
      />
    </div>
  );
};

export default IndicatorsList;
