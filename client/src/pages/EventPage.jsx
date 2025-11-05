import React from 'react';
import { useParams } from 'react-router-dom';
import EventDetails from '../components/events/EventDetails';

const EventPage = () => {
  const { eventId } = useParams();
  // TODO: Fetch event details using eventId

  return (
    <div className="container mx-auto px-4 py-8">
      <EventDetails event={null} />
    </div>
  );
};

export default EventPage;