import React from 'react';
import { Link } from 'react-router-dom';
import './ListIndicadores.css';

export default function ListIndicadores() {
    const indicadores = [
        { id: 1, nombre: 'Indicador1' }, 
        { id: 2, nombre: 'Indicador2' },
        { id: 3, nombre: 'Indicador3' },
        { id: 4, nombre: 'Indicador4' },
        { id: 6, nombre: 'Indicador6' },
        { id: 7, nombre: 'Indicador7' },
        { id: 8, nombre: 'Indicador8'},
        { id: 10, nombre: 'Indicador10'},
    ];

    return (
        <div className="list-indicadores-container">
            <h1 className="list-title">Lista de Indicadores</h1>
            <div className="indicadores-grid">
                {indicadores.map((indicador) => (
                    <div className="indicador-card" key={indicador.id}>
                        <h2>{indicador.nombre}</h2>
                        <Link to={`/${indicador.nombre.toLowerCase()}`} className="indicador-button">
                            Ver {indicador.nombre}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
