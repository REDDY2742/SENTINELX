import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle, Users, Briefcase, Activity, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ManagerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://13.201.79.48:8000/api/v1/auth/employee/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch manager stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
     return (
        <div className="h-[60vh] flex items-center justify-center">
           <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
     );
  }

  return (
    <div className="space-y-8">
      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Active Customers" value={stats?.activeCustomers} sub={stats?.newCustomers || "No recent signups"} icon={<Users className="text-blue-400" />} />
          <StatCard title="Pending Loans" value={stats?.pendingLoans} sub={stats?.pendingLoansSub || "All clear"} icon={<Briefcase className="text-amber-400" />} />
          <StatCard title="Fraud Alerts" value={stats?.fraudAlerts} sub={stats?.fraudAlertsSub || "System Secure"} icon={<ShieldAlert className="text-red-400 animate-pulse" />} />
          <StatCard title="Total Deposits" value={stats?.totalDeposits} sub={stats?.depositsSub || "+0.0%"} icon={<TrendingUp className="text-emerald-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                   <Activity className="w-5 h-5 text-indigo-500" /> Branch Activity
                </h3>
                <div className="flex gap-2 text-xs">
                   <span className="flex items-center gap-1 text-indigo-400"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Applications</span>
                   <span className="flex items-center gap-1 text-red-400"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Alerts</span>
                </div>
             </div>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.chartData || []}>
                   <defs>
                      <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAlert" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <XAxis dataKey="name" stroke="#64748b" />
                   <YAxis stroke="#64748b" />
                   <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                   <Area type="monotone" dataKey="applications" stroke="#6366f1" fillOpacity={1} fill="url(#colorApp)" />
                   <Area type="monotone" dataKey="alerts" stroke="#ef4444" fillOpacity={1} fill="url(#colorAlert)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* Quick Actions / Recent Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> Recent Actions
             </h3>
             <div className="space-y-4">
                {stats?.recentActions?.map((action: any, idx: number) => (
                    <ActionItem key={idx} title={action.title} desc={action.desc} time={action.time} type={action.type} />
                ))}
             </div>
             <Link to="/manager/performance" className="mt-6 block text-center w-full py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition text-sm font-medium">
                View All Activity
             </Link>
          </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) {
    return (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition group">
            <div className="flex justify-between items-center mb-4">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider group-hover:text-indigo-400 transition">{title}</p>
                {icon}
            </div>
            <h3 className="text-3xl font-light text-white mb-1">{value}</h3>
            <p className={`text-xs font-mono font-bold ${sub.includes('Risk') ? 'text-red-400' : 'text-emerald-400'}`}>{sub}</p>
        </div>
    )
}

function ActionItem({ title, desc, time, type }: { title: string, desc: string, time: string, type: 'success' | 'danger' | 'info' }) {
   const colors = {
      success: 'bg-emerald-500/10 text-emerald-400',
      danger: 'bg-red-500/10 text-red-400',
      info: 'bg-blue-500/10 text-blue-400'
   };
   
   return (
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition">
         <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors[type]}`}>
            {type === 'success' ? <CheckCircle className="w-4 h-4" /> : type === 'danger' ? <ShieldAlert className="w-4 h-4" /> : <Users className="w-4 h-4" />}
         </div>
         <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{title}</h4>
            <p className="text-xs text-slate-400 truncate">{desc}</p>
         </div>
         <span className="text-[10px] text-slate-600 font-mono whitespace-nowrap">{time}</span>
      </div>
   )
}
