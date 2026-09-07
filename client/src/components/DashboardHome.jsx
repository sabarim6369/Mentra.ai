import { Bot, CalendarPlus, CalendarDays, Plus } from 'lucide-react';

function DashboardHome({ onNavigate }) {
  const quickActions = [
    {
      title: 'Schedule Meeting',
      description: 'Create a new meeting with AI assistance',
      icon: CalendarPlus,
      action: () => onNavigate('meetings'),
      color: 'from-violet-500 to-purple-600'
    },
    {
      title: 'Create Agent',
      description: 'Build a new AI agent for your workflow',
      icon: Bot,
      action: () => onNavigate('agents'),
      color: 'from-fuchsia-500 to-pink-600'
    },
    {
      title: 'Calendar',
      description: 'See all your meetings in one place',
      icon: CalendarDays,
      action: () => onNavigate('calendar'),
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 p-6 text-white">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, User! 👋
              </h1>
              <p className="text-violet-100">
                Ready to supercharge your productivity with AI?
              </p>
            </div>
          </div>

          {/* Top Quick Buttons */}
          <div className="mt-4 flex gap-3">
            <button 
              onClick={() => onNavigate('meetings')}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </button>
            <button 
              onClick={() => onNavigate('agents')}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            >
              <Bot className="w-4 h-4 mr-2" />
              Create Agent
            </button>
            <button 
              onClick={() => onNavigate('calendar')}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.title}
              onClick={action.action}
              className="bg-slate-900/50 backdrop-blur-sm border border-violet-500/20 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group cursor-pointer rounded-xl p-4 text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardHome;