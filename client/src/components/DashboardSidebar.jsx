import { useState } from 'react';
import { Video, Bot, Calendar, Sparkles } from 'lucide-react';

function DashboardSidebar({ currentPage, onNavigate, isOpen, isCollapsed }) {
  const mainMenuItems = [
    {
      title: 'Meetings',
      icon: Video,
      page: 'meetings',
      description: 'Schedule and manage meetings',
    },
    {
      title: 'Agents',
      icon: Bot,
      page: 'agents',
      description: 'AI-powered assistants',
    },
    {
      title: 'Calendar',
      icon: Calendar,
      page: 'calendar',
      description: 'Calendar',
    },
  ];

  const handleNavigation = (page) => {
    onNavigate(page);
  };

  return (
    <div className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0
      border-r border-violet-500/20 bg-slate-950/95 backdrop-blur-xl shadow-sm
      fixed lg:relative h-full transition-all duration-300 z-50
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-violet-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  MentraAI
                </span>
                <p className="text-xs text-gray-400 font-medium">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3">
          <div className="mb-4">
            <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ${isCollapsed ? 'hidden' : 'px-2'}`}>
              Main Menu
            </p>
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavigation(item.page)}
                    className={`
                      group relative w-full h-10 px-3 rounded-lg transition-all duration-200 flex items-center
                      ${isActive 
                        ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30' 
                        : 'hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-purple-500/10'
                      }
                    `}
                    title={isCollapsed ? item.description : ''}
                  >
                    <div className={`
                      flex items-center justify-center w-6 h-6 rounded-md transition-colors flex-shrink-0
                      ${isActive ? 'text-violet-400' : 'text-gray-400 group-hover:text-violet-400'}
                    `}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium text-sm ml-3 text-gray-200">
                        {item.title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-violet-500/20 p-3">
          <button className="w-full h-12 p-2 rounded-lg hover:bg-violet-500/10 transition-all duration-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-medium text-gray-200 truncate">User</p>
                <p className="text-xs text-gray-400 truncate">user@example.com</p>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;