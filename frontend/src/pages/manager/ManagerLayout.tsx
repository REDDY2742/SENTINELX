import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Bell, Search, Settings, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  branchId?: string;
}

export default function ManagerLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        localStorage.removeItem('access_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 h-20 px-8 flex justify-between items-center">
            <div>
               <h1 className="text-xl font-bold tracking-tight text-white">Branch Portal</h1>
               <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Branch: New York - Downtown (BR-8821)
               </div>
            </div>
            
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
                 <div className="h-8 w-px bg-slate-800 mx-2"></div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold shadow-lg">
                        {user?.firstName?.charAt(0) || 'M'}
                    </div>
                    <span className="text-sm font-medium text-slate-300 hidden md:block">
                        {user?.firstName} {user?.lastName}
                    </span>
                 </div>
            </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
           <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
