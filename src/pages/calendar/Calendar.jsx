import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';
import { getIndicatorDeadlines } from '../../api/api';
import Modal from '../../components/modal/Modal';
import TaskList from './TaskList';
import { Link } from 'react-router-dom';

// Configuración de moment en español
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_')
});

const localizer = momentLocalizer(moment);

// Configuración de etiquetas en español para el calendario
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango de fechas.',
  showMore: total => `+ Ver más (${total})`
};

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await getIndicatorDeadlines();
        console.log(response)
        const deadlines = response.data.map((indicator) => ({
          id: indicator.id,
          title: `${indicator.name} (${indicator.is_completed ? 'Completado' : 'Pendiente'})`,
          start: new Date(indicator.delivery_date),
          end: new Date(indicator.delivery_date),
          color: '#4ecdc4',
          details: `Asignado a: ${indicator.assigned_user[0]?.name || 'Sin asignar'}`,
          photo: indicator.assigned_user[0]?.photo || ''
        }));
        console.log(deadlines)
        setEvents(deadlines);
      } catch (error) {
        console.error("Error al obtener fechas de entrega:", error);
      }
    };
    fetchDeadlines();
  }, []);

  const handleSelectEvent = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  return (
    <div className="calendar-tasklist-wrapper">
      <TaskList />
      <div className="my-calendar-container">
        <h2 className="calendar-title">Calendario de Indicadores</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({
            className: 'custom-event',
            style: { backgroundColor: event.color },
          })}
          messages={messages}
          formats={{
            monthHeaderFormat: 'MMMM YYYY',
            weekdayFormat: 'dddd',
            dayHeaderFormat: 'dddd D [de] MMMM',
            dayRangeHeaderFormat: ({ start, end }) => 
              `${moment(start).format('D [de] MMMM')} – ${moment(end).format('D [de] MMMM YYYY')}`
          }}
        />

        {selectedEvent && (
          <Modal isOpen={!!selectedEvent} onClose={closeModal} theme="light">
            <h2>{selectedEvent.title}</h2>
            <p><strong>Fecha:</strong> {moment(selectedEvent.start).format("LL")}</p>
            <p><strong>Estado:</strong> {selectedEvent.title.includes('Completado') ? 'Completado' : 'Pendiente'}</p>
            <p><strong>Responsables:</strong> {selectedEvent.details}</p>
            {selectedEvent.photo && (
              <img
                src={selectedEvent.photo}
                alt="Usuario asignado"
                className="responsable-photo"
              />
            )}
            <Link to = {`/registerIndicator/${selectedEvent.id}`}>Ir</Link>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default MyCalendar;