import api from './axios';

export const meetingsAPI = {
  // Get all meetings for a user
  getAll: async (userId, filters = {}) => {
    const response = await api.get('/meetings', { 
      params: { userId, ...filters }
    });
    return response.data;
  },

  // Get single meeting by ID
  getById: async (meetingId) => {
    const response = await api.get(`/meetings/${meetingId}`);
    return response.data;
  },

  // Create new meeting
  create: async (meetingData) => {
    const response = await api.post('/meetings', meetingData);
    return response.data;
  },

  // Update meeting
  update: async (meetingId, meetingData) => {
    const response = await api.put(`/meetings/${meetingId}`, meetingData);
    return response.data;
  },

  // Delete meeting
  delete: async (meetingId) => {
    const response = await api.delete(`/meetings/${meetingId}`);
    return response.data;
  },

  // Generate Stream Video token for meeting
  generateToken: async (meetingId, userId) => {
    const response = await api.post(`/meetings/${meetingId}/token`, { userId });
    return response.data;
  },
};
