import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import Modal from '../modal/Modal';
import InputText from '../inputs/InputText';
import CourseSelect from '../selected/CourseSelect';
import Table from '../table/Table'; 
import { Button } from '../buttons/Button';
import { registerIndicator12, getIndicator12Stats } from '../../api/api';
import TrimestreSelect from '../selected/TrimestreSelect';

const Indicator12 = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [generalStats, setGeneralStats] = useState({ total_licencias: 0, indice: 0 });

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getIndicator12Stats();
    
            const transformedData = response.data.courses.map(course => ({
                course_id: course.course_id,
                course_name: course.course_name,
                trimestre1: course.trimesters["1"]?.total_licencias || 0,
                trimestre2: course.trimesters["2"]?.total_licencias || 0,
                trimestre3: course.trimesters["3"]?.total_licencias || 0
            }));
    
            setEvaluations(transformedData);
            setGeneralStats(response.data.general);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const data = {
                indicator_id: 12,
                trimestre_id: parseInt(values.trimestre_id),
                course_id: parseInt(values.course_id),
                licencia: parseInt(values.licencia),
            };

            await registerIndicator12(data);
            resetForm();
            setModalOpen(false);
            fetchData(); // Recargar las evaluaciones después de agregar el progreso
        } catch (error) {
            console.error('Error al registrar:', error);
        }
    };

    const columns = [
        { header: 'Curso', accessor: 'course_name' },
        { header: 'Trimestre 1', accessor: 'trimestre1' },
        { header: 'Trimestre 2', accessor: 'trimestre2' },
        { header: 'Trimestre 3', accessor: 'trimestre3' }
    ];

    return (
        <div className="indicator-container">
            <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Progreso</button>
            <div className="professor-table">
                <h3>Estadísticas del Indicador 12</h3>
                {loading ? (
                    <p>Cargando datos...</p>
                ) : error ? (
                    <p>Error al cargar las estadísticas: {error.message}</p>
                ) : (
                    <>
                        <Table columns={columns} data={evaluations} />
                        <div className="general-stats">
                            <h4>Datos Generales</h4>
                            <p>Total Licencias: {generalStats.total_licencias}</p>
                            <p>Índice General: {parseFloat(generalStats.indice).toFixed(2)}%</p>
                        </div>
                    </>
                )}
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h2>Registrar Progreso</h2>
                <Formik
                    initialValues={{
                        trimestre_id: '',
                        course_id: '',
                        licencia: '',
                    }}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="form">
                            <TrimestreSelect
                                name="trimestre_id"
                                value={values.trimestre_id}
                                onChange={(e) => setFieldValue('trimestre_id', e.target.value)}
                                required={true}
                            />
                            <CourseSelect
                                label="Curso"
                                name="course_id"
                                required={true}
                                onChange={(e) => setFieldValue('course_id', e.target.value)}
                                value={values.course_id}
                            />
                            <InputText
                                label="Licencias"
                                placeholder="Ingrese la cantidad de licencias"
                                required={true}
                                type="number"
                                name="licencia"
                                value={values.licencia}
                                onChange={(e) => setFieldValue('licencia', e.target.value)}
                            />
                            <Button type="submit">Agregar Progreso</Button>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
    
};

export default Indicator12;
