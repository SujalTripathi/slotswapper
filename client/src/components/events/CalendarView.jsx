import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import CalendarLegend from './CalendarLegend';

const CalendarView = ({ events, onSlotClick }) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [weekDays, setWeekDays] = useState([]);
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 24 hours

  useEffect(() => {
    // Generate week days
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i));
    }
    setWeekDays(days);
  }, [currentWeek]);

  const getEventForTimeSlot = (day, hour) => {
    return events.find(event => {
      const eventDate = parseISO(event.startTime);
      return isSameDay(eventDate, day) && eventDate.getHours() === hour;
    });
  };

  const getSlotClass = (event) => {
    if (!event) return 'bg-white border calendar-slot';
    
    switch (event.status) {
      case 'BUSY':
        return 'status-busy border calendar-slot';
      case 'SWAPPABLE':
        return 'status-swappable border calendar-slot';
      case 'SWAP_PENDING':
        return 'status-pending border calendar-slot';
      default:
        return 'bg-white border calendar-slot';
    }
  };

  const handleSlotClick = (day, hour, event) => {
    console.log('Slot clicked:', { day, hour, event }); // Debug log
    if (onSlotClick) {
      onSlotClick(day, hour, event);
    }
  };

  return (
    <div className="calendar-wrapper">
      {/* Legend */}
      <CalendarLegend />
      
      <div className="table-responsive">
        <table className="table table-bordered calendar-table">
          <thead>
            <tr>
              <th style={{width: '100px', minWidth: '80px'}} className="text-center fw-bold bg-light">
                <i className="material-icons" style={{fontSize: '20px'}}>schedule</i>
              </th>
              {weekDays.map((day, index) => (
                <th key={index} className="text-center fw-bold bg-light" style={{minWidth: '120px'}}>
                  <div className="fw-bold">{format(day, 'EEE')}</div>
                  <div className="text-muted small">{format(day, 'MM/dd')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((hour) => (
              <tr key={hour}>
                <td className="text-center align-middle fw-semibold text-muted bg-light" style={{fontSize: '0.9rem'}}>
                  {format(new Date().setHours(hour), 'ha')}
                </td>
                {weekDays.map((day, dayIndex) => {
                  const event = getEventForTimeSlot(day, hour);
                  return (
                    <td
                      key={`${hour}-${dayIndex}`}
                      onClick={() => handleSlotClick(day, hour, event)}
                      className={`p-2 ${getSlotClass(event)}`}
                      style={{
                        minHeight: '70px', 
                        height: '70px', 
                        cursor: 'pointer', 
                        verticalAlign: 'top',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                      title={event ? `${event.title} - Click to manage` : 'Click to create event'}
                    >
                      {event && (
                        <div 
                          className="event-slot-content"
                          style={{
                            pointerEvents: 'none' // Allow clicks to pass through to the td
                          }}
                        >
                          <div className="fw-bold text-truncate mb-1" style={{fontSize: '0.85rem'}}>
                            {event.title}
                          </div>
                          <div className="text-muted" style={{fontSize: '0.75rem'}}>
                            <i className="material-icons align-middle me-1" style={{fontSize: '14px'}}>access_time</i>
                            {format(parseISO(event.startTime), 'h:mm a')}
                          </div>
                          {/* Click indicator */}
                          <div 
                            className="position-absolute top-0 end-0 p-1"
                            style={{
                              fontSize: '16px',
                              color: 'rgba(0,0,0,0.3)',
                              pointerEvents: 'none'
                            }}
                          >
                            <i className="material-icons">touch_app</i>
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;
