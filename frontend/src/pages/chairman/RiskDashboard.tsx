import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, BarChart as BarChartIcon, PieChart as PieChartIcon, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function RiskDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/admin/risk-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch risk stats:', err);
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

  const RISK_DISTRIBUTION = stats?.distribution || [];
  const WEEKLY_ALERTS = stats?.weeklyAlerts || [];
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div>
             <h1 className="text-2xl font-light text-white tracking-wide">Risk Control Center</h1>
             <p className="text-slate-400 text-sm mt-1">AI-driven risk assessment and threat mitigation.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-sm text-slate-400">System Status</div>
                <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                   <ShieldCheck className="w-4 h-4" /> {stats?.status || 'Secure'}
                </div>
             </div>
             <div className="w-px h-8 bg-slate-800" />
              <div className="text-right">
                 <div className="text-sm text-slate-400">Total Alerts</div>
                 <div className="text-white font-bold font-mono">{stats?.totalAlerts?.toLocaleString()}</div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <RiskCard title="Fraud Probability" value={stats?.fraudProb} change="-12%" trend="down" />
           <RiskCard title="Active Alerts" value={stats?.activeAlerts?.toString()} change="+5" trend="up" alert />
           <RiskCard title="Auto-Blocked" value={stats?.autoBlocked?.toLocaleString()} change="+8.5%" trend="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                 <PieChartIcon className="w-5 h-5 text-indigo-500" /> Risk Distribution
              </h3>
              <div className="flex items-center justify-center h-full pb-6">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={RISK_DISTRIBUTION}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {RISK_DISTRIBUTION.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="space-y-3">
                    {RISK_DISTRIBUTION.map((item: any) => (
                       <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300 text-sm whitespace-nowrap">{item.name} ({item.value}%)</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                 <BarChartIcon className="w-5 h-5 text-indigo-500" /> Weekly Alert Volume
              </h3>
             <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={WEEKLY_ALERTS}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                   <XAxis dataKey="name" stroke="#64748b" />
                   <YAxis stroke="#64748b" />
                   <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                   <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </ReBarChart>
             </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
}

function RiskCard({ title, value, change, trend, alert }: { title: string, value: string, change: string, trend: 'up' | 'down', alert?: boolean }) {
   return (
      <div className={`bg-slate-900 border rounded-xl p-6 transition ${alert ? 'border-red-500 shadow-lg shadow-red-500/10 animate-pulse-slow' : 'border-slate-800 hover:border-slate-600'}`}>
         <div className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2 flex justify-between items-center">
            {title}
            {alert && <AlertTriangle className="w-4 h-4 text-red-500" />}
         </div>
         <div className="flex items-end justify-between">
            <div className={`text-3xl font-light ${alert ? 'text-red-500 font-bold' : 'text-white'}`}>{value}</div>
            <div className={`text-xs font-bold px-2 py-1 rounded-full border flex items-center gap-1 ${
               trend === 'down' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
               alert ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
               'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            }`}>
               {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
               {change}
            </div>
         </div>
      </div>
   )
}
