import React from 'react';

const CalendarLegend = () => {
  const legendItems = [
    {
      status: 'BUSY',
      color: '#ffebee',
      borderColor: '#ef5350',
      icon: 'event_busy',
      label: 'Busy'
    },
    {
      status: 'SWAPPABLE',
      color: '#e8f5e9',
      borderColor: '#66bb6a',
      icon: 'event_available',
      label: 'Swappable'
    },
    {
      status: 'SWAP_PENDING',
      color: '#fff3e0',
      borderColor: '#ffa726',
      icon: 'pending',
      label: 'Swap Pending'
    }
  ];

  return (
    <div className="calendar-legend mb-3 p-3 bg-white rounded shadow-sm">
      <div className="d-flex align-items-center flex-wrap gap-3">
        <span className="fw-semibold text-muted me-2">
          <i className="material-icons align-middle me-1" style={{fontSize: '20px'}}>info</i>
          Legend:
        </span>
        {legendItems.map((item) => (
          <div key={item.status} className="d-flex align-items-center">
            <div
              className="legend-box me-2"
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: item.color,
                border: `3px solid ${item.borderColor}`,
                borderRadius: '4px'
              }}
            />
            <span className="small fw-medium text-secondary">
              <i className="material-icons align-middle me-1" style={{fontSize: '16px'}}>
                {item.icon}
              </i>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
