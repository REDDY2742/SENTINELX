import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Bell, Search, Settings } from 'lucide-react';

export default function ChairmanLayout() {
  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 h-20 px-8 flex justify-between items-center">
            <h1 className="text-xl font-light tracking-wide text-white">
                Admin Panel <span className="text-slate-500 text-sm ml-2">v2.4.0 (Enterprise)</span>
            </h1>
            
            <div className="flex items-center gap-6">
                 <div className="relative group">
                    <Search className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition cursor-pointer" />
                 </div>
                 <div className="relative group">
                    <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition cursor-pointer" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
                 </div>
                 <div className="relative group">
                    <Settings className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition cursor-pointer" />
                 </div>
            </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
