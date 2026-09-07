import { useState } from 'react';
import { Bot, Plus, Search, ArrowRight, Filter } from 'lucide-react';

const agentTypeColors = {
  assistant: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  analyst: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
  facilitator: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  specialist: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
};

const agentTypeLabels = {
  assistant: 'Assistant',
  analyst: 'Analyst',
  facilitator: 'Facilitator',
  specialist: 'Specialist',
};

// Mock data
const mockAgents = [
  {
    id: '1',
    name: 'Strategy Assistant',
    type: 'assistant',
    description: 'Helps with strategic planning and business decision-making.',
    capabilities: ['Strategic Planning', 'Market Analysis', 'Decision Support'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Meeting Facilitator',
    type: 'facilitator',
    description: 'Manages meeting flow, takes notes, and provides summaries.',
    capabilities: ['Meeting Management', 'Note Taking', 'Action Item Tracking'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Data Analyst',
    type: 'analyst',
    description: 'Analyzes data and provides insights and recommendations.',
    capabilities: ['Data Analysis', 'Visualization', 'Reporting'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'Technical Specialist',
    type: 'specialist',
    description: 'Provides technical expertise and architectural guidance.',
    capabilities: ['Technical Consultation', 'Architecture Design', 'Code Review'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

function AgentsView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [agents] = useState(mockAgents);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchInput.toLowerCase());
    const matchesType = typeFilter === 'all' || agent.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (agents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Agents</h1>
            <p className="text-gray-400">Create and manage AI-powered assistants</p>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Agent
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-blue-500/20 rounded-3xl flex items-center justify-center">
              <Bot className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold text-white mb-3">
            Create Your First Agent
          </h3>
          <p className="text-gray-400 mb-6 max-w-md">
            Build AI-powered assistants tailored to your specific needs. 
            Configure capabilities, set personalities, and automate your workflows.
          </p>
          
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-lg text-white font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Agent
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-gray-400">
            {agents.length} agent{agents.length !== 1 ? 's' : ''} available
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

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-40 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="assistant">Assistant</option>
                <option value="analyst">Analyst</option>
                <option value="facilitator">Facilitator</option>
                <option value="specialist">Specialist</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Search className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No agents found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters, or create a new agent.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredAgents.map((agent) => {
            const typeColor = agentTypeColors[agent.type];
            return (
              <div 
                key={agent.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02] bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {agent.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${typeColor.bg} ${typeColor.text} ${typeColor.border} border`}>
                      {agentTypeLabels[agent.type]}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {agent.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.slice(0, 3).map((capability, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                          {capability}
                        </span>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
                          +{agent.capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    Created {new Date(agent.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AgentsView;