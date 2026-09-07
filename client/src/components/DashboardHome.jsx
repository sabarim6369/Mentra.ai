import { Link } from 'react-router-dom';
import { Bot, CalendarPlus, CalendarDays, Plus } from 'lucide-react';

function DashboardHome() {
  const quickActions = [
    {
      title: 'Schedule Meeting',
      description: 'Create a new meeting with AI assistance',
      icon: CalendarPlus,
      path: '/dashboard/meetings',
    },
    {
      title: 'Create Agent',
      description: 'Build a new AI agent for your workflow',
      icon: Bot,
      path: '/dashboard/agents',
    },
    {
      title: 'Calendar',
      description: 'See all your meetings in one place',
      icon: CalendarDays,
      path: '/dashboard/calendar',
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-xl bg-blue-600 p-4 md:p-6 text-white">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, User! 👋
              </h1>
              <p className="text-blue-100">
                Ready to supercharge your productivity with AI?
              </p>
            </div>
          </div>

          {/* Top Quick Buttons */}
          <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
            <Link 
              to="/dashboard/meetings"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              New Meeting
            </Link>
            <Link 
              to="/dashboard/agents"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center"
            >
              <Bot className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Create Agent
            </Link>
            <Link 
              to="/dashboard/calendar"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center"
            >
              <CalendarDays className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Link
              key={action.title}
              to={action.path}
              className="bg-slate-900 border border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group cursor-pointer rounded-xl p-4 text-left h-full min-h-[100px] block"
            >
              <div className="flex items-start gap-4 h-full">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors text-sm md:text-base">
                    {action.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardHome;