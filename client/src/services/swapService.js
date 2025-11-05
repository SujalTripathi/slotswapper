import api from './api';
import { toast } from 'react-toastify';

const swapService = {
  async getSwappableSlots() {
    const response = await api.get('/swaps/swappable');
    return response.data;
  },

  async createSwapRequest(mySlotId, theirSlotId) {
    try {
      const response = await api.post('/swaps/request', { mySlotId, theirSlotId });
      toast.success('Swap request sent successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send swap request';
      toast.error(message);
      throw error;
    }
  },

  async respondToSwap(requestId, action) {
    try {
      const response = await api.post(`/swaps/respond/${requestId}`, { action });
      if (action === 'accept') {
        toast.success('Swap request accepted! Slots have been exchanged.');
      } else {
        toast.info('Swap request rejected');
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to respond to swap';
      toast.error(message);
      throw error;
    }
  },

  async getMySwapRequests() {
    const response = await api.get('/swaps/my-requests');
    return response.data;
  }
};

export default swapService;