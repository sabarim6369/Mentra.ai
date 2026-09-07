import { useState } from 'react';
import { Video, Plus, Search, Calendar, ArrowRight, Sparkles, Bot, Clock, X, Filter } from 'lucide-react';

const statusColors = {
  upcoming: { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/30' },
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
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

// Mock data
const mockMeetings = [
  {
    id: '1',
    name: 'Product Strategy Discussion',
    status: 'upcoming',
    agentName: 'Strategy Assistant',
    scheduledStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    duration: 3600000,
    instructions: 'Discuss Q4 product roadmap and strategic priorities for the upcoming quarter.',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Team Standup',
    status: 'active',
    agentName: 'Meeting Facilitator',
    scheduledStartTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    duration: 1800000,
    instructions: 'Daily team standup to discuss progress and blockers.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Client Review Meeting',
    status: 'completed',
    agentName: 'Client Relations Bot',
    scheduledStartTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 5400000,
    instructions: 'Review project deliverables with the client and gather feedback.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    name: 'Technical Architecture Planning',
    status: 'upcoming',
    agentName: 'Tech Lead Assistant',
    scheduledStartTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration: 7200000,
    instructions: 'Plan the technical architecture for the new microservices implementation.',
    createdAt: new Date().toISOString()
  }
];

function MeetingsView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [meetings] = useState(mockMeetings);

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
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-4 py-2 rounded-lg text-white font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Meeting
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
              <Video className="w-12 h-12 text-violet-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
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
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-lg text-white font-medium flex items-center"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Meetings</h1>
          <p className="text-gray-400">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-lg text-white font-medium flex items-center"
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
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-violet-500/30 rounded-md text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40 pl-10 pr-4 py-2 bg-slate-900/50 border border-violet-500/30 rounded-md text-gray-300 focus:outline-none focus:border-violet-500 appearance-none cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => {
            const statusColor = statusColors[meeting.status];
            const scheduledTime = formatScheduledTime(meeting.scheduledStartTime);
            return (
              <div 
                key={meeting.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-[1.02] bg-slate-900/50 backdrop-blur-sm border border-violet-500/20 rounded-xl p-6"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-1">
                      {meeting.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor.bg} ${statusColor.text} ${statusColor.border} border`}>
                        {statusLabels[meeting.status]}
                      </span>
                      {meeting.duration && (
                        <span className="text-xs px-2 py-1 rounded-full border border-gray-600 text-gray-300 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(meeting.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-400 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Bot className="w-4 h-4" />
                    <span>Agent: {meeting.agentName}</span>
                  </div>
                  {scheduledTime && (
                    <div className="flex items-center space-x-2 text-sm text-violet-400">
                      <Calendar className="w-4 h-4" />
                      <span>Scheduled: {scheduledTime}</span>
                    </div>
                  )}
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {meeting.instructions}
                  </p>
                  <div className="text-xs text-gray-500">
                    Created {new Date(meeting.createdAt).toLocaleDateString()}
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

export default MeetingsView;