import api from './axios';

export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response.data;
  },
};
