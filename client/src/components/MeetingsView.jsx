import { useState, useEffect } from 'react';
import { Video, Plus, Search, Calendar, ArrowRight, Bot, Clock, Filter, X } from 'lucide-react';
import Modal from './Modal';
import { meetingsAPI } from '../api/meetings';
import { agentsAPI } from '../api/agents';

const statusColors = {
  upcoming: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  active: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
  completed: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
  processing: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
};

const statusLabels = {
  upcoming: 'Upcoming',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
  processing: 'Processing',
};

function MeetingsView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [meetings, setMeetings] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMeeting, setNewMeeting] = useState({
    name: '',
    agentId: '',
    scheduledStartTime: '',
    instructions: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMeetings();
    fetchAgents();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const data = await meetingsAPI.getAll(user.id);
      setMeetings(data);
    } catch (err) {
      setError('Failed to fetch meetings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const data = await agentsAPI.getAll(user.id);
      setAgents(data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return null;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatScheduledTime = (scheduledTime) => {
    if (!scheduledTime) return null;
    const date = new Date(scheduledTime);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    }
    
    const isTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString() === date.toDateString();
    if (isTomorrow) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    }
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                         meeting.instructions.toLowerCase().includes(searchInput.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateMeeting = async () => {
    try {
      setError('');
      await meetingsAPI.create({
        name: newMeeting.name,
        userId: user.id,
        agentId: newMeeting.agentId,
        instructions: newMeeting.instructions,
        scheduledStartTime: newMeeting.scheduledStartTime ? new Date(newMeeting.scheduledStartTime).toISOString() : null
      });
      setIsCreateDialogOpen(false);
      setNewMeeting({
        name: '',
        agentId: '',
        scheduledStartTime: '',
        instructions: ''
      });
      fetchMeetings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create meeting');
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await meetingsAPI.delete(meetingId);
      fetchMeetings();
    } catch (err) {
      setError('Failed to delete meeting');
    }
  };

  const getAgentName = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : 'Unknown Agent';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meetings</h1>
            <p className="text-gray-400">Schedule and manage AI-powered meetings</p>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Meeting
          </button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-400">Loading meetings...</div>
        </div>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meetings</h1>
            <p className="text-gray-400">Schedule and manage AI-powered meetings</p>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Meeting
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-blue-500/20 rounded-3xl flex items-center justify-center">
              <Video className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold text-white mb-3">
            Schedule Your First Meeting
          </h3>
          <p className="text-gray-400 mb-6 max-w-md">
            Create AI-powered meetings with your virtual assistants. 
            Set agendas, get summaries, and let AI help facilitate your discussions.
          </p>
          
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-lg text-white font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Your First Meeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Meetings</h1>
          <p className="text-gray-400">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium flex items-center"
 disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Meeting
        </button>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <Search className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No meetings found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters, or create a new meeting.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMeetings.map((meeting) => {
            const statusColor = statusColors[meeting.status];
            const scheduledTime = formatScheduledTime(meeting.scheduledStartTime);
            return (
              <div 
                key={meeting.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02] bg-slate-900 border border-slate-800 rounded-xl p-6 relative"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this meeting?')) {
                      handleDeleteMeeting(meeting.id);
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
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {meeting.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor.bg} ${statusColor.text} ${statusColor.border} border`}>
                        {statusLabels[meeting.status]}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <Bot className="w-4 h-4" />
                    <span>Agent: {getAgentName(meeting.agentId)}</span>
                  </div>
                  {scheduledTime && (
                    <div className="flex items-center space-x-2 text-sm text-blue-400">
                      <Calendar className="w-4 h-4" />
                      <span>Scheduled: {scheduledTime}</span>
                    </div>
                  )}
                  <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {meeting.instructions}
                  </p>
                  <div className="text-xs text-slate-500">
                    Created {new Date(meeting.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Meeting Modal */}
      <Modal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Create New Meeting"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Meeting Name</label>
            <input
              type="text"
              value={newMeeting.name}
              onChange={(e) => setNewMeeting({ ...newMeeting, name: e.target.value })}
              placeholder="Enter meeting name"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Agent</label>
            <select
              value={newMeeting.agentId}
              onChange={(e) => setNewMeeting({ ...newMeeting, agentId: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Scheduled Time (optional)</label>
            <input
              type="datetime-local"
              value={newMeeting.scheduledStartTime}
              onChange={(e) => setNewMeeting({ ...newMeeting, scheduledStartTime: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Instructions</label>
            <textarea
              value={newMeeting.instructions}
              onChange={(e) => setNewMeeting({ ...newMeeting, instructions: e.target.value })}
              placeholder="Enter meeting instructions or agenda"
              rows="4"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              required
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
              onClick={handleCreateMeeting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create Meeting
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MeetingsView;