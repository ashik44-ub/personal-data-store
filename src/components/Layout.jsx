import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Tags, Wallet, LogOut, Receipt, Lock, Menu, X as CloseIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Layout = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Salaries', path: '/salaries', icon: Wallet },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Categories', path: '/categories', icon: Tags },
    { name: 'Passwords', path: '/passwords', icon: Lock },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
          <div className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <div className={cn(
          "w-72 bg-white border-r border-gray-100 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 fixed md:static inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="flex items-center justify-between gap-3 mb-10 animate-in slide-in-from-left-8 fade-in duration-700">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-float">
                      <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">POS System</h1>
              </div>
              <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsSidebarOpen(false)}>
                  <CloseIcon className="w-6 h-6" />
              </button>
          </div>
          <nav className="space-y-3">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={cn(
                    "flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold animate-in slide-in-from-left-4 fade-in fill-mode-both",
                    isActive ? "bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-[1.02] translate-x-2" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                  )}
                >
                  <Icon className={cn("w-6 h-6", isActive ? "text-indigo-400" : "")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-6 md:p-8 pb-10 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100/50 flex items-center space-x-4 group cursor-pointer hover:bg-indigo-50 transition-colors">
             <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-xl flex items-center justify-center text-indigo-700 font-black border border-indigo-200/50 shadow-sm group-hover:scale-110 transition-transform">
                {user?.username?.charAt(0).toUpperCase()}
             </div>
             <div className="overflow-hidden">
               <div className="text-sm font-bold text-gray-900 truncate">{user?.username}</div>
               <div className="text-xs font-semibold text-gray-500 truncate">{user?.email}</div>
             </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center space-x-3 px-5 py-3.5 rounded-2xl w-full text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative" style={{ backgroundColor: '#F8FAFC' }}>
        <header className="bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 md:px-10 py-4 md:py-6 sticky top-0 z-30 flex items-center justify-between shadow-sm animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden flex items-center justify-center bg-white p-2.5 border border-gray-200 rounded-xl shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-xl md:text-2xl font-black text-gray-800 capitalize tracking-tight flex items-center gap-3">
                    <div className="hidden md:block w-2 h-8 bg-indigo-500 rounded-full animate-pulse"></div>
                    {location.pathname === '/dashboard' ? 'Overview' : location.pathname.substring(1)}
                </h2>
            </div>
            <div className="hidden sm:block text-xs md:text-sm font-bold text-gray-500 tracking-widest uppercase">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        </header>
        <main className="p-4 md:p-10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
