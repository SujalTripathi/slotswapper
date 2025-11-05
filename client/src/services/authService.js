import api from './api';
import { toast } from 'react-toastify';

const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      toast.success(`Welcome, ${userData.name}! Account created successfully.`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      toast.success('Welcome back! Logged in successfully.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
  },

  getCurrentUser() {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }
};

export default authService;