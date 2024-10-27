import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';
import TaskList from './TaskList';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

function MyCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null); // Estado para el evento seleccionado

  // Generador de colores aleatorios para eventos
  const getRandomColor = () => {
    const colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#6a4c93", "#ff9f1c"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const events = [
    {
      title: "Fecha de Entrega Indicador",
      start: new Date(),
      end: new Date(),
      details: "Indicador sobre el progreso mensual.",
      color: getRandomColor(),
    },
    {
      title: "Revisión Trimestral",
      start: new Date(new Date().setDate(new Date().getDate() + 7)),
      end: new Date(new Date().setDate(new Date().getDate() + 7)),
      details: "Revisión detallada del último trimestre.",
      color: getRandomColor(),
    },
  ];

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // Cierra el modal
  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="calendar-container">
      <h2 className="calendar-title">Calendario de Indicadores</h2>
      <div className="calendar-tasklist-wrapper">
        <TaskList />
        <div className="my-calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent} // Maneja el clic en el evento
            eventPropGetter={(event) => ({
            className: 'custom-event',
              style: { backgroundColor: event.color }, // Asigna un color aleatorio al evento
            })}
          onRequestClose={closeModal}
          />
        </div>
      </div>

      {/* Modal para mostrar detalles del evento */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          contentLabel="Detalles del Evento"
          className="event-modal"
          overlayClassName="event-modal-overlay"
        >
          <h2>{selectedEvent.title}</h2>
          <p><strong>Fecha de Inicio:</strong> {moment(selectedEvent.start).format("LL")}</p>
          <p><strong>Fecha de Fin:</strong> {moment(selectedEvent.end).format("LL")}</p>
          <p><strong>Detalles:</strong> {selectedEvent.details}</p>
          <button onClick={closeModal} className="close-button">Cerrar</button>
        </Modal>
      )}
    </div>
  );
}

export default MyCalendar;
