import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EventList from '../components/events/EventList';
import CalendarView from '../components/events/CalendarView';
import CreateEventForm from '../components/events/CreateEventForm';
import EventDetailsModal from '../components/events/EventDetailsModal';
import SwapList from '../components/swaps/SwapList';
import eventService from '../services/eventService';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setShowCreateForm(true);
  };

  const handleEventCreated = () => {
    setShowCreateForm(false);
    fetchEvents();
  };

  const handleSlotClick = (day, hour, event) => {
    if (!event) {
      setShowCreateForm(true);
    } else {
      setSelectedEvent(event);
      setShowEventDetails(true);
    }
  };

  const handleMakeSwappable = async (eventId) => {
    try {
      const newStatus = selectedEvent.status === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
      await eventService.updateEvent(eventId, { status: newStatus });
      fetchEvents();
    } catch (err) {
      console.error('Failed to update event status:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  return (
    <div className="container-fluid py-4" style={{backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 56px)'}}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <div className="card-body p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="text-white">
                    <h1 className="mb-2 fw-bold">
                      <i className="material-icons align-middle me-2" style={{fontSize: '36px'}}>waving_hand</i>
                      Welcome, {user?.name || 'User'}!
                    </h1>
                    <p className="mb-0 opacity-90" style={{fontSize: '1.1rem'}}>
                      Manage your calendar and create swappable time slots
                    </p>
                  </div>
                  <button
                    onClick={handleCreateEvent}
                    className="btn btn-light btn-lg px-4 py-3 shadow-sm"
                    style={{
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <i className="material-icons align-middle me-2" style={{fontSize: '24px'}}>add_circle</i>
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="btn-group shadow" role="group" style={{borderRadius: '10px', overflow: 'hidden'}}>
              <button
                onClick={() => setViewMode('calendar')}
                className={`btn btn-lg ${
                  viewMode === 'calendar'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                }`}
                style={{
                  padding: '12px 30px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="material-icons align-middle me-2" style={{fontSize: '20px'}}>calendar_month</i>
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-lg ${
                  viewMode === 'list'
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                }`}
                style={{
                  padding: '12px 30px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="material-icons align-middle me-2" style={{fontSize: '20px'}}>list</i>
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Calendar/List View */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body p-3 p-md-4">
                {viewMode === 'calendar' ? (
                  <CalendarView events={events} onSlotClick={handleSlotClick} />
                ) : (
                  <EventList userEvents={true} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active Swaps Section */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{borderRadius: '12px'}}>
              <div className="card-header py-3" style={{
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px'
              }}>
                <h4 className="mb-0 text-white fw-bold">
                  <i className="material-icons align-middle me-2" style={{fontSize: '28px'}}>swap_horiz</i>
                  Your Active Swaps
                </h4>
              </div>
              <div className="card-body p-3 p-md-4" style={{backgroundColor: '#fafafa'}}>
                <SwapList />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={showEventDetails}
        onClose={() => {
          setShowEventDetails(false);
          setSelectedEvent(null);
        }}
        onMakeSwappable={handleMakeSwappable}
        onDelete={handleDeleteEvent}
      />

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="material-icons align-middle me-2" style={{fontSize: '24px'}}>event</i>
                  Create New Event
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCreateForm(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <CreateEventForm onSuccess={handleEventCreated} />
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
