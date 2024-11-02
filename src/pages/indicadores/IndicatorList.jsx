import { useEffect, useState, lazy, Suspense, useMemo } from 'react';
import { getIndicatorByUsername } from '../../api/api';
import { getUser } from '../login/authFunctions';
import Table from '../../components/table/Table';
import { Button } from '../../components/buttons/Button';
import ColumnToggle from '../../components/table/ColumnToggle';
import Modal from '../../components/modal/Modal'; 
import './ListIndicadores.css'; 
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';

const LinkButton = lazy(() => import('../../components/buttons/LinkButton'));

const IndicatorsList = () => {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useMemo(() => getUser(), []);
  const isAdmin = useMemo(() => currentUser?.roles.includes("Administrador"), [currentUser]);

  const [columnsState, setColumnsState] = useState([
    { id: 'id', header: "ID", accessor: 'id', isHidden: false },
    { id: 'name', header: 'Nombre', accessor: 'name', isHidden: false },
    { id: 'expected_result', header: 'Resultado Esperado', accessor: 'expected_result', isHidden: false },
    { id: 'academic_objective', header: 'Objetivo Académico', accessor: 'academic_objective', isHidden: true },
    { id: 'sgc_objective', header: 'Objetivo SGC', accessor: 'sgc_objective', isHidden: true },
    { id: 'formula', header: 'Fórmula', accessor: 'formula', isHidden: false },
    { id: 'is_completed', header: 'Completado', accessor: 'is_completed', isHidden: false},
    { id: 'actions', header: 'Acciones', accessor: 'actions', isHidden: false, 
      render: (row) => (
        <Suspense fallback={<span>Loading...</span>}>
          <LinkButton to={`/registerIndicator/${row.id}`} className="indicador-button">
            Registrar
          </LinkButton>
        </Suspense>
      )
    },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = getUser();
      if (user && user.username) {
        try {
          const res = await getIndicatorByUsername(user.username);
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
    };

    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const visibleColumns = columnsState.filter(column => !column.isHidden);

  const handleColumnChange = (updatedColumns) => {
    setColumnsState(updatedColumns);
  };

  return (
    <div>
    <Breadcrumb />
      <h1>Lista de Indicadores</h1>
        

      <div className="button-container">
      {isAdmin && (
          <Suspense fallback={<p>Cargando botón...</p>}>
          <LinkButton to="registerIndicator" className="indicador-button">
            Registrar indicador
          </LinkButton>
        </Suspense>
        )}
        <Suspense fallback={<p>Cargando botón...</p>}>
          <LinkButton to="asignerCordinator" className="indicador-button">
            Asignar Coordinador
          </LinkButton>
        </Suspense>
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