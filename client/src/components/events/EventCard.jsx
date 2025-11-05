import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from 'react-bootstrap';
import { formatDate } from '../../utils/dateUtils';
import eventService from '../../services/eventService';

const EventCard = ({ event, onStatusChange }) => {
  const { id, title, startTime, endTime, status } = event;

  const handleMakeSwappable = async () => {
    try {
      await eventService.makeEventSwappable(id);
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Failed to update event status:', error);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'BUSY':
        return 'danger';
      case 'SWAPPABLE':
        return 'success';
      case 'SWAP_PENDING':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className={`event-card status-${status.toLowerCase()}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <Card.Title>{title}</Card.Title>
          <Badge bg={getStatusVariant(status)}>{status}</Badge>
        </div>
        <Card.Text>
          <div className="mb-2">
            <i className="material-icons align-middle me-2">event</i>
            {formatDate(startTime)}
          </div>
          <div>
            <i className="material-icons align-middle me-2">event_busy</i>
            {formatDate(endTime)}
          </div>
        </Card.Text>
        <div className="d-flex justify-content-end gap-2">
          {status === 'BUSY' && (
            <Button
              variant="success"
              onClick={handleMakeSwappable}
            >
              Make Swappable
            </Button>
          )}
          <Link to={`/events/${id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard;