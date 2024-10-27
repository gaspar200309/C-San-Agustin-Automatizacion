import React from 'react';
import './TaskList.css';

function TaskList() {
  const tasks = [
    { id: 1, title: 'Completar informe semanal', dueDate: '2024-10-30' },
    { id: 2, title: 'Revisión de indicadores', dueDate: '2024-11-02' },
    { id: 3, title: 'Actualizar datos trimestrales', dueDate: '2024-11-05' },
    // Agrega más tareas
  ];

  return (
    <div className="tasklist-container">
      <button className="add-event-button">Añadir Nuevo Evento</button>

      <h3 className="tasklist-title">Lista de Tareas e Indicadores</h3>
      <ul className="tasklist">
        {tasks.map(task => (
          <li key={task.id} className="tasklist-item">
            <span className="task-title">{task.title}</span>

            <span className="task-due-date">{task.dueDate}</span>
            <hr/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
