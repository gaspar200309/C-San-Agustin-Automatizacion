import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import Modal from '../modal/Modal';
import InputText from '../inputs/InputText';
import CourseSelect from '../selected/CourseSelect';
import Table from '../table/Table';
import { Button } from '../buttons/Button';
import { registerIndicator13, getIndicator13Stats } from '../../api/api';
import TrimestreSelect from '../selected/TrimestreSelect';

const Indicator13 = () => {
    const [incidences, setIncidences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [generalStats, setGeneralStats] = useState({
        total_incidencias_por_trimestre: {},
        indice_por_trimestre: {},
        total_incidencias_general: 0
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getIndicator13Stats();

            const transformedData = response.data.courses.map(course => ({
                course_id: course.course_id,
                course_name: course.course_name,
                trimestre1: course.trimesters.find(t => t.trimestre_id === 1)?.total_incidencias || 0,
                trimestre2: course.trimesters.find(t => t.trimestre_id === 2)?.total_incidencias || 0,
                trimestre3: course.trimesters.find(t => t.trimestre_id === 3)?.total_incidencias || 0,
            }));

            setIncidences(transformedData);
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
                indicator_id: 13,
                trimestre_id: parseInt(values.trimestre_id),
                course_id: parseInt(values.course_id),
                incidencias: parseInt(values.incidencias),
            };

            await registerIndicator13(data);
            resetForm();
            setModalOpen(false);
            fetchData();
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
            <button className="open-modal-btn" onClick={() => setModalOpen(true)}>Agregar Incidencia</button>
            <div className="professor-table">
                <h3>Estadísticas del Indicador 13</h3>
                {loading ? (
                    <p>Cargando datos...</p>
                ) : error ? (
                    <p>Error al cargar las estadísticas: {error.message}</p>
                ) : (
                    <Table columns={columns} data={incidences} />
                )}
            </div>
            {/* Datos generales debajo de la tabla */}
            <div className="general-stats">
                <h4>Datos Generales</h4>
                <p>Incidencias por trimestre:</p>
                {Object.entries(generalStats.total_incidencias_por_trimestre).map(([trimestre, total]) => (
                    <p key={trimestre}>Trimestre {trimestre}: {total} incidencias</p>
                ))}
                <p>Índice de incidencias por trimestre:</p>
                {Object.entries(generalStats.indice_por_trimestre).map(([trimestre, indice]) => (
                    <p key={trimestre}>Trimestre {trimestre}: {indice}%</p>
                ))}
                {/* Mostrar total general de incidencias */}
                <p>Total general de incidencias: {generalStats.total_incidencias_general}</p>
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h2>Registrar Incidencia</h2>
                <Formik
                    initialValues={{
                        trimestre_id: '',
                        course_id: '',
                        incidencias: '',
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
                                label="Incidencias"
                                placeholder="Ingrese la cantidad de incidencias"
                                required={true}
                                type="number"
                                name="incidencias"
                                value={values.incidencias}
                                onChange={(e) => setFieldValue('incidencias', e.target.value)}
                            />
                            <Button type="submit">Agregar Incidencia</Button>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default Indicator13;
