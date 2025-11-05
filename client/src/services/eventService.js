import api from './api';
import { toast } from 'react-toastify';

const eventService = {
  async createEvent(eventData) {
    try {
      const response = await api.post('/events', eventData);
      toast.success('Event created successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create event';
      toast.error(message);
      throw error;
    }
  },

  async getAllEvents() {
    const response = await api.get('/events');
    return response.data;
  },

  async getUserEvents() {
    // Gets events for the currently logged-in user
    const response = await api.get('/events');
    return response.data;
  },

  async getEventById(id) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      toast.success('Event updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event';
      toast.error(message);
      throw error;
    }
  },

  async deleteEvent(id) {
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete event';
      toast.error(message);
      throw error;
    }
  },

  async makeEventSwappable(id) {
    const response = await api.patch(`/events/${id}/swappable`);
    return response.data;
  }
};

export default eventService;