import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import EventCard from './EventCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const EventList = ({ userEvents = false }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = userEvents
          ? await eventService.getUserEvents()
          : await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userEvents]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!events.length) return <p className="text-gray-500">No events found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;