import React from 'react';
import EventList from '../components/events/EventList';

const Events = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Events</h1>
      <EventList />
    </div>
  );
};

export default Events;