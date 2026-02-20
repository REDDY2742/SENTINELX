import { useState, useEffect } from 'react';
import { TrendingUp, Globe, DollarSign, Activity, AlertTriangle, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/v1/auth/admin/overview', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
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
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-white">Executive Overview</h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Global Performance · LIVE DATA</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <div className="text-sm text-slate-400">Net Asset Value</div>
              <div className="text-xl font-medium text-emerald-400">{stats?.navValue || '₹0Cr'}</div>
           </div>
           <div className="w-px bg-slate-800 h-10"></div>
           <div className="text-right">
              <div className="text-sm text-slate-400">Stock Price (SNTL)</div>
              <div className="text-xl font-medium text-indigo-400">₹{stats?.stockPrice?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '142.50'}</div>
           </div>
        </div>
      </header>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ExecCard title="Total Revenue" value={`₹${(stats?.totalBalance || 0).toLocaleString('en-IN')}`} sub={stats?.revenueGrowth + " Growth"} icon={<DollarSign className="text-emerald-400" />} />
          <ExecCard title="Active Customers" value={`${(stats?.customerCount || 0)}`} sub={stats?.revenueGrowth + " QoQ"} icon={<Globe className="text-blue-400" />} />
          <ExecCard title="Fraud Loss Ratio" value={stats?.fraudRatio} sub="Calculated from real activity" icon={<AlertTriangle className="text-amber-400" />} />
          <ExecCard title="OpEx Efficiency" value={stats?.efficiency} sub="Live Performance Target" icon={<Activity className="text-purple-400" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-96">
              <h3 className="font-semibold mb-6 flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Revenue Growth vs Risk
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.revenue_data || []}>
                      <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#475569" />
                      <YAxis stroke="#475569" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
                      <Area type="monotone" dataKey="risk" stroke="#f43f5e" fillOpacity={0} strokeDasharray="5 5" />
                  </AreaChart>
              </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="font-semibold mb-6 flex items-center gap-2 text-white">
                  <Globe className="w-5 h-5 text-cyan-500" />
                  Regional Performance
              </h3>
              <div className="space-y-4">
                  {stats?.regional_performance?.map((reg: any, idx: number) => (
                      <RegionRow 
                        key={idx}
                        region={reg.region} 
                        amt={reg.amt} 
                        growth={reg.growth} 
                        highlight={reg.highlight} 
                      />
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}

function RegionRow({ region, amt, growth, highlight }: { region: string, amt: string, growth: string, highlight?: boolean }) {
    return (
        <div className={`flex items-center justify-between p-4 rounded-lg border ${
            highlight ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-slate-800/50 border-slate-800'
        }`}>
            <span className="font-medium text-slate-300">{region}</span>
            <div className="flex items-center gap-6">
                <span className="text-white font-mono">{amt}</span>
                <span className={`text-sm ${growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{growth}</span>
            </div>
        </div>
    )
}

function ExecCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) {
    return (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition group">
            <div className="flex justify-between items-start mb-4">
               <span className="text-slate-500 text-sm font-medium uppercase tracking-wider group-hover:text-indigo-400 transition">{title}</span>
               {icon}
            </div>
            <div className="text-3xl font-light text-white mb-1">{value}</div>
            <div className="text-xs font-mono text-slate-400">{sub}</div>
        </div>
    )
}
