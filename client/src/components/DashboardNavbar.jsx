import { Menu } from 'lucide-react';

function DashboardNavbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900">
      <div className="flex h-14 items-center gap-4 px-4">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden h-7 w-7 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <h1 className="font-semibold text-white">Dashboard</h1>
        </div>
      </div>
    </header>
  );
}

export default DashboardNavbar;