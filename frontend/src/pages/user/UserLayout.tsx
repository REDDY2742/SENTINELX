import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { Settings, Bell, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CurrencyProvider } from '../../context/CurrencyContext';
import { useWebSocket } from '../../context/WebSocketContext';

interface UserData {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  branch?: string;
  branchId?: string;
  accountType?: string;
  accountNumber?: string;
  accountStatus?: string;
  balance: string | number;
  currency?: string;
}

export default function UserLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      if (loading) navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://13.201.79.48:8000/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('User fetch error:', err);
      // Only redirect if it's the initial load or a 401
      // For now, let's keep it simple.
    } finally {
      setLoading(false);
    }
  };

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (lastMessage?.refresh || lastMessage?.type === 'refresh_data') {
      fetchUser();
    }
  }, [lastMessage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <CurrencyProvider userPreference={user?.currency}>
      <div className="flex bg-slate-950 text-white min-h-screen">
        <Sidebar balance={user?.balance} />
        <main className="flex-1 ml-64 flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 h-20 px-8 flex justify-between items-center">
            <div className="flex items-center gap-4 text-slate-400 font-medium">
               <span className="text-xl text-white">Dashboard</span>
               <span className="text-slate-700">|</span>
               <span className="text-sm">Welcome back, {user?.firstName || 'User'}</span>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="relative group">
                  <Search className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition cursor-pointer" />
               </div>
               <div className="relative group">
                  <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition cursor-pointer" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
               </div>
               <div className="relative group">
                  <Settings 
                    className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition cursor-pointer" 
                    onClick={() => navigate('/user/profile')}
                  />
               </div>
               <div className="h-8 w-[1px] bg-slate-800"></div>
               <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-slate-900 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-800">
                  <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/20">
                     {user?.firstName?.[0] || 'U'}
                  </div>
                  <div className="text-sm text-left hidden lg:block">
                     <div className="font-medium text-white">{user?.firstName} {user?.lastName}</div>
                     <div className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')} Account</div>
                  </div>
               </div>
            </div>
          </header>
          
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
             <Outlet context={{ user, refreshUser: fetchUser }} />
          </div>
        </main>
      </div>
    </CurrencyProvider>
  );
}
