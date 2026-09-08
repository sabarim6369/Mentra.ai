import api from './axios';

export const agentsAPI = {
  // Get all agents for a user
  getAll: async (userId) => {
    const response = await api.get('/agents', { params: { userId } });
    return response.data;
  },

  // Get single agent by ID
  getById: async (agentId) => {
    const response = await api.get(`/agents/${agentId}`);
    return response.data;
  },

  // Create new agent
  create: async (agentData) => {
    const response = await api.post('/agents', agentData);
    return response.data;
  },

  // Update agent
  update: async (agentId, agentData) => {
    const response = await api.put(`/agents/${agentId}`, agentData);
    return response.data;
  },

  // Delete agent
  delete: async (agentId) => {
    const response = await api.delete(`/agents/${agentId}`);
    return response.data;
  },
};
