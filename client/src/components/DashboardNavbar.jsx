import { useState, useEffect } from 'react';
import { Search, Command, Menu } from 'lucide-react';

function DashboardNavbar({ onToggleSidebar }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchItems = [
    { 
      title: 'Meetings', 
      description: 'View and manage your meetings',
      page: 'meetings',
    },
    { 
      title: 'Agents', 
      description: 'AI agents and assistants',
      page: 'agents',
    },
    { 
      title: 'Calendar', 
      description: 'View your calendar',
      page: 'calendar',
    },
  ];

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleItemSelect = (page) => {
    setIsSearchOpen(false);
    // In a real app, this would navigate to the page
    console.log('Navigate to:', page);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-violet-500/20 bg-black/95 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-4 px-4">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden h-7 w-7 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 flex-1">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            <h1 className="font-semibold text-white">Dashboard</h1>
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="relative w-64 justify-start text-sm text-gray-400 bg-slate-900/80 border border-violet-500/30 hover:bg-slate-800/80 rounded-md px-3 py-2 flex items-center"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search anything...</span>
            <div className="ml-auto flex items-center gap-0.5">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-gray-300 opacity-100 hidden sm:flex">
                <Command className="h-3 w-3" />
              </kbd>
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-gray-300 opacity-100 hidden sm:flex">
                K
              </kbd>
            </div>
          </button>
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-violet-500/30 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-violet-500/20">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Quick Actions
                </p>
                {searchItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => handleItemSelect(item.page)}
                    className="w-full flex items-center py-2 px-3 rounded-md hover:bg-violet-500/10 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-6 h-6 bg-violet-500/20 rounded-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-violet-500 rounded-sm"></div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardNavbar;