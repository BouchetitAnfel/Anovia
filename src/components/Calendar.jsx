import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns';
import { Plus, Calendar as CalendarIcon, X } from 'lucide-react';
import '../styles/Calendar.css';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [events, setEvents] = useState({});

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const toggleHighlight = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    if (highlightedDates.includes(dateStr)) {
      setHighlightedDates(prev => prev.filter(d => d !== dateStr));
    } else {
      setHighlightedDates(prev => [...prev, dateStr]);
      setSelectedDate(dateStr);
      setShowEventForm(true);
    }
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim() && selectedDate) {
      setEvents(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), {
          id: Date.now(),
          title: newEventTitle,
          date: selectedDate
        }]
      }));
      setNewEventTitle('');
      setShowEventForm(false);
    }
  };

  const handleDeleteEvent = (dateStr, eventId) => {
    setEvents(prev => ({
      ...prev,
      [dateStr]: prev[dateStr].filter(event => event.id !== eventId)
    }));
  };

  const allEvents = Object.values(events).flat();
  
  const currentMonthEvents = allEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return isSameMonth(eventDate, currentMonth);
  });

  return (
    <div className="mini-calendar-wrapper">
      <div className="mini-calendar">
        <div className="mini-calendar-header">
          <button 
            className="mini-calendar-nav-button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            ←
          </button>
          <span className="mini-calendar-month-title">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            className="mini-calendar-nav-button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            →
          </button>
          
          <button 
            className="mini-calendar-add-button"
            onClick={() => setIsHighlightMode(!isHighlightMode)}
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="mini-calendar-day-names">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="mini-calendar-day-name">
              {day.charAt(0)}
            </div>
          ))}
        </div>

        <div className="mini-calendar-days-grid">
          {monthDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasEvents = events[dateStr] && events[dateStr].length > 0;
            
            return (
              <div 
                key={dateStr}
                className={`mini-calendar-day-cell ${
                  isToday(day) ? 'mini-calendar-today' : ''
                } ${
                  !isSameMonth(day, currentMonth) ? 'mini-calendar-other-month' : ''
                } ${
                  highlightedDates.includes(dateStr) ? 'mini-calendar-highlighted' : ''
                } ${
                  hasEvents ? 'mini-calendar-has-events' : ''
                }`}
                onClick={() => {
                  if (isHighlightMode) {
                    toggleHighlight(day);
                  } else if (hasEvents) {
                    setSelectedDate(dateStr);
                  }
                }}
              >
                {format(day, 'd')}
                {hasEvents && <span className="mini-calendar-event-dot"></span>}
              </div>
            );
          })}
        </div>
        
        {isHighlightMode && (
          <div className="mini-calendar-instruction">
            Click dates to add events
          </div>
        )}
      </div>

      {showEventForm && (
        <div className="event-form-overlay">
          <h5>Add Event for {format(parseISO(selectedDate), 'MMMM d, yyyy')}</h5>
          <div className="mini-calendar-event-input-group">
            <input 
              type="text"
              placeholder="Event title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="mini-calendar-event-input"
            />
            <div >
              <button 
                onClick={handleAddEvent}
                className="plus"
                disabled={!newEventTitle.trim()}
              >            <Plus size={14} />

              </button>
             
            </div>
          </div>
        </div>
      )}

      <div className="mini-calendar-events-list">
        <h4 className="mini-calendar-events-title">
          <CalendarIcon size={14} className="mini-calendar-events-icon" />
          Events
        </h4>
        {currentMonthEvents.length > 0 ? (
          <ul className="mini-calendar-events">
            {currentMonthEvents.map(event => (
              <li key={event.id} className="mini-calendar-event-item">
                <div className="mini-calendar-event-content">
                  <span className="mini-calendar-event-date">
                    {format(parseISO(event.date), 'MMM d')}
                  </span>
                  <span className="mini-calendar-event-title">{event.title}</span>
                </div>
                <button 
                  className="mini-calendar-event-delete"
                  onClick={() => handleDeleteEvent(event.date, event.id)}
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mini-calendar-no-events">No events for this month</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;