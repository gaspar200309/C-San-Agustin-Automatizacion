import { useEffect, useState, lazy, Suspense, useMemo, useCallback } from 'react';
import { getIndicatorByUsername } from '../../api/api';
import { getUser } from '../login/authFunctions';
import Table from '../../components/table/Table';
import { Button } from '../../components/buttons/Button';
import ColumnToggle from '../../components/table/ColumnToggle';
import Modal from '../../components/modal/Modal';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Loader from '../../components/loader/Loader';

const LinkButton = lazy(() => import('../../components/buttons/LinkButton'));

const IndicatorsList = () => {
  const [indicators, setIndicators] = useState([]);
  console.log(indicators);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = useMemo(() => getUser(), []);
  const isAdmin = useMemo(() => currentUser?.roles.includes("Administrador"), [currentUser]);

  // Column definitions with memoization
  const columnsState = useMemo(() => ([
    { id: 'id', header: "ID", accessor: 'id', isHidden: false },
    { id: 'name', header: 'Nombre', accessor: 'name', isHidden: false },
    { id: 'expected_result', header: 'Resultado Esperado', accessor: 'expected_result', isHidden: false },
    { id: 'academic_objective', header: 'Objetivo Académico', accessor: 'academic_objective', isHidden: false },
    { id: 'sgc_objective', header: 'Objetivo SGC', accessor: 'sgc_objective', isHidden: false },
    { id: 'formula', header: 'Fórmula', accessor: 'formula', isHidden: true },
    { id: 'is_completed', header: 'Completado', accessor: 'is_completed', isHidden: true },
    { id: 'actions', header: 'Acciones', accessor: 'actions', isHidden: false, 
      render: (row) => (
        <Suspense fallback={<span>Loading...</span>}>
          <LinkButton to={`/registerIndicator/${row.id}`} className="indicador-button">
            Registrar
          </LinkButton>
        </Suspense>
      )
    },
  ]), []);

  const visibleColumns = useMemo(() => columnsState.filter(column => !column.isHidden), [columnsState]);

  const fetchData = useCallback(async () => {
    if (currentUser && currentUser.username) {
      try {
        const res = await getIndicatorByUsername(currentUser.username);
        setIndicators(res.data);
      } catch (err) {
        setError('Error al cargar los indicadores');
      } finally {
        setLoading(false);
      }
    } else {
      setError('No se encontró información del usuario');
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch indicators on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleColumnChange = useCallback((updatedColumns) => {
    setColumnsState(updatedColumns);
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <Breadcrumb />
      <h1>Lista de Indicadores</h1>

      <div className="button-container">
        {isAdmin && (
          <Suspense fallback={<p>Cargando botón...</p>}>
            <LinkButton to="asignerCordinator" className="indicador-button">
              Asignar Coordinador
            </LinkButton>
          </Suspense>
        )}
      </div>

      <Button onClick={() => setIsModalOpen(true)}>Mostrar/Ocultar Columnas</Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Seleccionar Columnas</h2>
        <ColumnToggle allColumns={columnsState} onColumnChange={handleColumnChange} />
      </Modal>

      <Table 
        columns={visibleColumns} 
        data={indicators} 
        onRowClick={(row) => console.log('Row clicked:', row)} 
      />
    </div>
  );
};

export default IndicatorsList;
