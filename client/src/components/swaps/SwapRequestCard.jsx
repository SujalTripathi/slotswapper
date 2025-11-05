import React from 'react';
import { format, parseISO } from 'date-fns';

const SwapRequestCard = ({ swap, onAccept, onReject, type }) => {
  const { _id, mySlot, theirSlot, requestingUser, targetUser, status } = swap;

  // Guard against null/undefined slots
  if (!mySlot || !theirSlot) {
    return null;
  }

  const formatDateTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy h:mm a');
    } catch (err) {
      return dateString;
    }
  };

  const statusColors = {
    PENDING: 'status-pending',
    ACCEPTED: 'status-swappable',
    REJECTED: 'status-busy',
  };

  return (
    <div className="card border-0 shadow-sm hover-lift" style={{borderRadius: '12px'}}>
      <div className="card-body p-3">
        {/* Status Badge */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span className={`badge ${statusColors[status]} px-3 py-2`}>
            <i className="material-icons align-middle me-1" style={{fontSize: '16px'}}>
              {status === 'PENDING' ? 'pending' : status === 'ACCEPTED' ? 'check_circle' : 'cancel'}
            </i>
            {status}
          </span>
          {type === 'incoming' && (
            <small className="text-muted">
              <i className="material-icons align-middle" style={{fontSize: '16px'}}>person</i>
              {requestingUser.name}
            </small>
          )}
          {type === 'outgoing' && (
            <small className="text-muted">
              <i className="material-icons align-middle" style={{fontSize: '16px'}}>person</i>
              {targetUser.name}
            </small>
          )}
        </div>

        {/* Slots Comparison */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="p-2 bg-light rounded">
              <small className="text-muted d-block mb-1">
                <i className="material-icons align-middle me-1" style={{fontSize: '14px'}}>schedule</i>
                {type === 'incoming' ? 'Your Slot' : 'Your Offer'}
              </small>
              <div className="fw-bold small">{type === 'incoming' ? theirSlot.title : mySlot.title}</div>
              <small className="text-muted">{formatDateTime(type === 'incoming' ? theirSlot.startTime : mySlot.startTime)}</small>
            </div>
          </div>
          <div className="col-6">
            <div className="p-2 bg-light rounded">
              <small className="text-muted d-block mb-1">
                <i className="material-icons align-middle me-1" style={{fontSize: '14px'}}>swap_horiz</i>
                {type === 'incoming' ? 'Their Offer' : 'Requested'}
              </small>
              <div className="fw-bold small">{type === 'incoming' ? mySlot.title : theirSlot.title}</div>
              <small className="text-muted">{formatDateTime(type === 'incoming' ? mySlot.startTime : theirSlot.startTime)}</small>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {type === 'incoming' && status === 'PENDING' && (
          <div className="d-flex gap-2">
            <button
              onClick={() => onReject(_id)}
              className="btn btn-outline-danger btn-sm flex-fill"
              style={{borderRadius: '8px'}}
            >
              <i className="material-icons align-middle me-1" style={{fontSize: '18px'}}>close</i>
              Reject
            </button>
            <button
              onClick={() => onAccept(_id)}
              className="btn btn-success btn-sm flex-fill"
              style={{borderRadius: '8px'}}
            >
              <i className="material-icons align-middle me-1" style={{fontSize: '18px'}}>check</i>
              Accept
            </button>
          </div>
        )}

        {type === 'outgoing' && status === 'PENDING' && (
          <div className="text-center">
            <small className="text-muted">
              <i className="material-icons align-middle me-1" style={{fontSize: '16px'}}>schedule</i>
              Waiting for response...
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapRequestCard;