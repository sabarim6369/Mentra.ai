import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Video, Bot, Calendar, Sparkles, LogOut } from 'lucide-react';

function DashboardSidebar({ isOpen, isCollapsed }) {
  const location = useLocation();
  
  const mainMenuItems = [
    {
      title: 'Dashboard',
      icon: Video,
      path: '/dashboard',
      description: 'Dashboard overview',
    },
    {
      title: 'Meetings',
      icon: Video,
      path: '/dashboard/meetings',
      description: 'Schedule and manage meetings',
    },
    {
      title: 'Agents',
      icon: Bot,
      path: '/dashboard/agents',
      description: 'AI-powered assistants',
    },
    {
      title: 'Calendar',
      icon: Calendar,
      path: '/dashboard/calendar',
      description: 'Calendar',
    },
  ];

  return (
    <div className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0
      border-r border-slate-800 bg-slate-900 shadow-sm
      fixed lg:relative h-screen transition-all duration-300 z-50
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-slate-800 p-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-lg font-bold text-white">
                  MentraAI
                </span>
                <p className="text-xs text-slate-400 font-medium">Dashboard</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3">
          <div className="mb-4">
            <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ${isCollapsed ? 'hidden' : 'px-2'}`}>
              Main Menu
            </p>
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={`
                      group relative w-full h-10 px-3 rounded-lg transition-all duration-200 flex items-center
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }
                    `}
                    title={isCollapsed ? item.description : ''}
                  >
                    <div className={`
                      flex items-center justify-center w-6 h-6 rounded-md transition-colors flex-shrink-0
                    `}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium text-sm ml-3">
                        {item.title}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-slate-800 p-3">
          <div className="w-full h-12 p-2 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-medium text-white truncate">User</p>
                <p className="text-xs text-slate-400 truncate">user@example.com</p>
              </div>
            )}
            <Link 
              to="/"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-slate-400 hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;