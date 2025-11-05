import React from 'react';
import { format, parseISO } from 'date-fns';

const EventDetailsModal = ({ event, isOpen, onClose, onMakeSwappable, onDelete }) => {
  if (!isOpen || !event) return null;

  const formatDateTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy h:mm a');
    } catch (err) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      BUSY: { color: 'status-busy', icon: 'event_busy', label: 'Busy' },
      SWAPPABLE: { color: 'status-swappable', icon: 'event_available', label: 'Swappable' },
      SWAP_PENDING: { color: 'status-pending', icon: 'pending', label: 'Swap Pending' }
    };
    return badges[status] || badges.BUSY;
  };

  const badge = getStatusBadge(event.status);

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{borderRadius: '16px'}}>
          {/* Header */}
          <div className="modal-header border-0" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }}>
            <h5 className="modal-title text-white fw-bold">
              <i className="material-icons align-middle me-2" style={{fontSize: '28px'}}>event</i>
              Event Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {/* Status Badge */}
            <div className="mb-4">
              <span className={`badge ${badge.color} px-3 py-2`} style={{fontSize: '1rem'}}>
                <i className="material-icons align-middle me-2" style={{fontSize: '20px'}}>
                  {badge.icon}
                </i>
                {badge.label}
              </span>
            </div>

            {/* Event Title */}
            <div className="mb-4">
              <h4 className="fw-bold mb-0">{event.title}</h4>
            </div>

            {/* Time Details */}
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="material-icons text-primary me-2">schedule</i>
                <div>
                  <small className="text-muted d-block">Start Time</small>
                  <strong>{formatDateTime(event.startTime)}</strong>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <i className="material-icons text-danger me-2">schedule</i>
                <div>
                  <small className="text-muted d-block">End Time</small>
                  <strong>{formatDateTime(event.endTime)}</strong>
                </div>
              </div>
            </div>

            {/* Duration Info */}
            <div className="alert alert-info border-0 mb-0" style={{backgroundColor: '#e3f2fd'}}>
              <i className="material-icons align-middle me-2" style={{fontSize: '20px'}}>info</i>
              <small>
                {event.status === 'BUSY' && 'This slot is currently busy. You can make it swappable.'}
                {event.status === 'SWAPPABLE' && 'This slot is available for swapping with other users.'}
                {event.status === 'SWAP_PENDING' && 'A swap request is pending for this slot.'}
              </small>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="modal-footer border-0 p-4 pt-0">
            <div className="d-flex gap-2 w-100">
              {event.status === 'BUSY' && (
                <button
                  onClick={() => {
                    onMakeSwappable(event._id);
                    onClose();
                  }}
                  className="btn btn-success flex-fill"
                  style={{borderRadius: '10px', fontWeight: '600'}}
                >
                  <i className="material-icons align-middle me-2" style={{fontSize: '20px'}}>
                    swap_horiz
                  </i>
                  Make Swappable
                </button>
              )}
              
              {event.status === 'SWAPPABLE' && (
                <button
                  onClick={() => {
                    onMakeSwappable(event._id);
                    onClose();
                  }}
                  className="btn btn-warning flex-fill"
                  style={{borderRadius: '10px', fontWeight: '600'}}
                >
                  <i className="material-icons align-middle me-2" style={{fontSize: '20px'}}>
                    block
                  </i>
                  Mark as Busy
                </button>
              )}

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onDelete(event._id);
                    onClose();
                  }
                }}
                className="btn btn-outline-danger"
                style={{borderRadius: '10px', fontWeight: '600'}}
              >
                <i className="material-icons align-middle me-1" style={{fontSize: '20px'}}>
                  delete
                </i>
                Delete
              </button>

              <button
                onClick={onClose}
                className="btn btn-secondary"
                style={{borderRadius: '10px', fontWeight: '600'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
