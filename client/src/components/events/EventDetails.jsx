import React from 'react';

const EventDetails = ({ event }) => {
  if (!event) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="font-semibold">Date & Time</h3>
          <p>{event.datetime}</p>
        </div>
        <div>
          <h3 className="font-semibold">Location</h3>
          <p>{event.location}</p>
        </div>
        <div>
          <h3 className="font-semibold">Description</h3>
          <p>{event.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Available Slots</h3>
          {/* TODO: Implement slots display */}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;