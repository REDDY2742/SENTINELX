import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, ArrowRight, Activity, Home, PieChart, Settings, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  balance: string | number;
  accountNumber: string;
  accountType: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [transferAmount, setTransferAmount] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('access_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const TRANSACTIONS = [
    { id: 1, to: 'Initial Deposit', date: 'Account Opening', amount: userData?.balance || 0, type: 'credit' },
  ];

  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <Sidebar role="Customer" onLogout={handleLogout} />
      <main className="flex-1 p-8 ml-64">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back, {userData?.firstName || 'User'}</h1>
            <p className="text-slate-400">Here is your financial overview</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2.5 rounded-lg font-medium text-sm">
            <DollarSign className="w-4 h-4" />
            Send Money
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Account Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl border border-white/10 shadow-xl group hover:scale-[1.02] transition-all">
             <div className="flex justify-between items-start mb-10">
               <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                 <CreditCard className="w-6 h-6 text-white" />
               </div>
               <span className="text-indigo-100 text-sm font-mono tracking-widest">
                 {userData?.accountNumber ? `**** ${userData.accountNumber.slice(-4)}` : '**** 0000'}
               </span>
             </div>
             <div>
               <p className="text-indigo-200 text-sm mb-1 uppercase tracking-wider font-medium">
                 {userData?.accountType || 'Savings'} Account Balance
               </p>
               <h2 className="text-4xl font-bold tracking-tight text-white mb-2">
                 ₹{Number(userData?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
               </h2>
               <p className="text-indigo-100/60 text-xs">Available for withdrawal</p>
             </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs mb-1">Monthly Spending</p>
                <h4 className="text-xl font-bold">₹0.00</h4>
              </div>
              <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs mb-1">Savings Goals</p>
                <h4 className="text-xl font-bold">₹0.00</h4>
              </div>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <PieChart className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-indigo-400" /> Quick Transfer
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500 font-medium">₹</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition text-sm shadow-lg shadow-indigo-600/20">
                Transfer Now
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-slate-100">Recent Activity</h3>
            <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300">View All Transactions</button>
          </div>
          <div className="divide-y divide-slate-700">
            {TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-slate-750 transition px-6 group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {tx.type === 'credit' ? <ArrowRight className="w-6 h-6 -rotate-45" /> : <Activity className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">{tx.to}</div>
                    <div className="text-xs text-slate-500 font-medium">{tx.date}</div>
                  </div>
                </div>
                <div className={`font-mono text-lg font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function Sidebar({ role, onLogout }: { role: string, onLogout: () => void }) {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Sentinel Bank
        </span>
      </div>
      <div className="mb-6 px-4 py-2 bg-slate-900 rounded-lg text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] border border-slate-800/50">
        {role} Portal
      </div>

      <div className="space-y-2 flex-1">
        <NavItem icon={<Home />} label="Dashboard" active />
        <NavItem icon={<PieChart />} label="Investments" />
        <NavItem icon={<CreditCard />} label="My Cards" />
        <NavItem icon={<Activity />} label="Transactions" />
      </div>

      <div className="pt-6 border-t border-slate-800 space-y-2">
         <NavItem icon={<Settings />} label="Settings" />
         <button onClick={onLogout} className="w-full">
            <NavItem icon={<LogOut />} label="Logout" />
         </button>
      </div>
    </nav>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
      active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100 group'
    }`}>
      <span className={`transition-transform duration-300 ${active ? '' : 'group-hover:scale-110'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      </span>
      <span className="font-bold text-sm">{label}</span>
    </div>
  );
}
