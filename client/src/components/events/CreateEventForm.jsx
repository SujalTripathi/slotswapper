import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../../services/eventService';

const CreateEventForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    status: 'BUSY' // Default status
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Event title is required');
      return false;
    }
    if (!formData.startTime) {
      setError('Start time is required');
      return false;
    }
    if (!formData.endTime) {
      setError('End time is required');
      return false;
    }
    // Check if end time is after start time
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError('End time must be after start time');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await eventService.createEvent(formData);
      if (onSuccess) {
        onSuccess();
      }
      // Clear form
      setFormData({
        title: '',
        startTime: '',
        endTime: '',
        status: 'BUSY'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="startTime" className="form-label">
          Start Time
        </label>
        <input
          type="datetime-local"
          id="startTime"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="endTime" className="form-label">
          End Time
        </label>
        <input
          type="datetime-local"
          id="endTime"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="text-end">
        <button
          type="submit"
          className="btn btn-primary"
        >
          Create Event
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;