import React from 'react';
import { Link } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa';
import './ListIndicadores.css';

export default function ListIndicadores() {
    const indicadores = [
        {
            id: 1,
            nombre: 'Nivel de cumplimiento en la entrega de documentos requeridos por autoridades educativas para el cierre e inicio de gestión.',
            lineaBase: 'ÓPTIMO (5)',
            formula: ' (5) ÓPTIMO, (4) MUY BUENO, (3) BUENO, (2) REGULAR, (1) INSUFICIENTE'
        },
        { id: 2, nombre: 'Indicador2', lineaBase: '200', formula: 'Formula2' },
        { id: 3, nombre: 'Indicador3', lineaBase: '300', formula: 'Formula3' },
        { id: 4, nombre: 'Indicador4', lineaBase: '400', formula: 'Formula4' },
        { id: 6, nombre: 'Indicador6', lineaBase: '500', formula: 'Formula5' },
        { id: 7, nombre: 'Indicador7', lineaBase: '600', formula: 'Formula6' },
        { id: 8, nombre: 'Indicador8', lineaBase: '700', formula: 'Formula7' },
        { id: 10, nombre: 'Indicador10', lineaBase: '800', formula: 'Formula8' },
    ];

    return (
        <div className="list-indicadores-container">
            <h1 className="list-title">Lista de Indicadores</h1>
            <table className="indicadores-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Línea Base</th>
                        <th>Fórmula</th>
                        <th>Registrar</th>
                    </tr>
                </thead>
                <tbody>
                    {indicadores.map((indicador) => (
                        <tr key={indicador.id} className="indicador-row">
                            <td className="nombre-cell">{indicador.nombre}</td>
                            <td>{indicador.lineaBase}</td>
                            <td>{indicador.formula}</td>
                            <td>
                                <Link to={`/Indicador${indicador.id}`} className="indicador-button">
                                    <FaTasks className="icon" /> Registrar
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
