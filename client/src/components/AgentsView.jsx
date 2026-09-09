import { useState, useEffect } from 'react';
import { Bot, Plus, Search, ArrowRight, Filter } from 'lucide-react';
import Modal from './Modal';
import { agentsAPI } from '../api/agents';

function AgentsView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAgent, setNewAgent] = useState({
    name: '',
    instructions: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await agentsAPI.getAll(user.id);
      setAgents(data);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                         agent.instructions.toLowerCase().includes(searchInput.toLowerCase());
    return matchesSearch;
  });

  const handleCreateAgent = async () => {
    try {
      setError('');
      await agentsAPI.create({
        name: newAgent.name,
        userId: user.id,
        instructions: newAgent.instructions
      });
      setIsCreateDialogOpen(false);
      setNewAgent({ name: '', instructions: '' });
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create agent');
    }
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      await agentsAPI.delete(agentId);
      fetchAgents();
    } catch (err) {
      setError('Failed to delete agent');
    }
  };

  return (
    <>
      {/* Create Agent Modal - Always rendered */}
      <Modal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Create New Agent"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Agent Name</label>
            <input
              type="text"
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              placeholder="Enter agent name"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Instructions</label>
            <textarea
              value={newAgent.instructions}
              onChange={(e) => setNewAgent({ ...newAgent, instructions: e.target.value })}
              placeholder="Describe what this agent should do, its personality, and any specific guidelines..."
              rows="5"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsCreateDialogOpen(false)}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAgent}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create Agent
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Agents</h1>
            <p className="text-gray-400">
              {agents.length === 0 ? 'Create and manage AI-powered assistants' : `${agents.length} agent${agents.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Agent
          </button>
        </div>

      <div className="flex items-center space-x-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search agents..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Search className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No agents found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or create a new agent.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAgents.map((agent) => (
            <div 
              key={agent.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02] bg-slate-900 border border-slate-800 rounded-xl p-6 relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this agent?')) {
                    handleDeleteAgent(agent.id);
                  }
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {agent.name}
                  </h3>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                  {agent.instructions}
                </p>
                
                <div className="text-xs text-slate-500">
                  Created {new Date(agent.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default AgentsView;