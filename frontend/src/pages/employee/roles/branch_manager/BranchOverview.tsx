import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Users, Activity, 
  ShieldCheck, Banknote, Clock, ArrowUpRight,
  Target, BarChart3, Layers
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

interface BranchOverviewProps {
  stats: any;
  user: any;
}

export default function BranchManagerOverview({ stats, user }: BranchOverviewProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header with quick stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
              Executive Command
            </div>
            <span className="text-slate-600 text-[10px] font-mono">• {user?.branch || 'Branch Network'}</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">
            Branch <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">Performance</span> Overview
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Consolidated real-time analytics for <span className="text-slate-300 font-bold">{user?.branch}</span> operations.</p>
        </div>
        
        <div className="flex bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-1">
             {['Real-time', 'Quarterly', 'Projected'].map((t, i) => (
                 <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                     {t}
                 </button>
             ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIBox 
          title="Gross Revenue" 
          value={stats.branchRevenue} 
          sub={stats.revenueGrowth} 
          trend="up" 
          icon={<TrendingUp />} 
          color="indigo" 
          onClick={() => navigate('/employee/targets')}
        />
        <KPIBox 
          title="Operational Expense" 
          value={stats.branchExpenses} 
          sub="MTD Spend" 
          trend="down" 
          icon={<Banknote />} 
          color="purple" 
          onClick={() => navigate('/employee/reports')}
        />
        <KPIBox 
          title="Asset Inflow" 
          value={stats.totalDeposits} 
          sub="+2.4% vs prev week" 
          trend="up" 
          icon={<Layers />} 
          color="emerald" 
          onClick={() => navigate('/employee/performance')}
        />
        <KPIBox 
          title="Staff Efficiency" 
          value={stats.staffPerformance} 
          sub="Avg Service Time: 4.2m" 
          trend="up" 
          icon={<Target />} 
          color="amber" 
          onClick={() => navigate('/employee/staff')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics Chart */}
        <div 
          onClick={() => navigate('/employee/performance')}
          className="lg:col-span-2 bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-700 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-indigo-500/20"></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight underline decoration-indigo-500/30 underline-offset-8 decoration-2">Transactional Velocity</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-3">Daily Processing Volume (Last 7 Days)</p>
            </div>
            <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Volume</span>
                 </div>
            </div>
          </div>

          <div className="h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="managerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  axisLine={false} 
                  tickLine={false} 
                  dy={15}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  axisLine={false} 
                  tickLine={false} 
                  dx={-15}
                />
                <Tooltip 
                  cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '6 6' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b', 
                    borderRadius: '20px',
                    fontSize: '11px',
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                    padding: '12px 16px'
                  }} 
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#6366f1" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#managerGrad)" 
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Activity Stream */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 rounded-[2.5rem] p-8 flex flex-col group hover:border-purple-500/20 transition-all duration-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Activity className="w-5 h-5 text-indigo-500" /> Activity Stream
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">LIVE FEED</span>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {stats.recentActions?.map((action: any, idx: number) => (
              <div key={idx} className="flex gap-4 p-4 rounded-3xl bg-slate-950/20 border border-slate-800/50 hover:bg-slate-800/40 hover:border-slate-800 transition-all duration-300 group/item cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${
                  action.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white' : 
                  'bg-indigo-500/10 border-indigo-500/20 text-indigo-500 group-hover/item:bg-indigo-600 group-hover/item:text-white'
                }`}>
                  {action.type === 'success' ? <TrendingUp className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white mb-1 group-hover/item:text-indigo-400 transition-colors truncate">{action.title}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate mb-2">{action.desc}</p>
                  <div className="flex items-center gap-1.5 grayscale opacity-60">
                    <Clock className="w-3 h-3" />
                    <span className="text-[9px] font-mono font-bold tracking-tight">{action.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/employee/reports')}
            className="w-full mt-8 py-4 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-500 shadow-2xl active:scale-[0.98]"
          >
            Access Global Logs
          </button>
        </div>
      </div>

      {/* Secondary Analytics - Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/employee/approvals')}
          className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-500 cursor-pointer"
        >
           <div>
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:rotate-12 transition-transform duration-500">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-1 tracking-tight">Pending Approvals</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">Items awaiting managerial override</p>
           </div>
           <div className="flex items-end justify-between mt-8">
              <span className="text-5xl font-black text-white tracking-tighter">{stats.pendingApprovals}</span>
              <button className="p-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                 <ArrowUpRight className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div 
          onClick={() => navigate('/employee/staff')}
          className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between group hover:border-purple-500/30 transition-all duration-500 cursor-pointer"
        >
           <div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:rotate-12 transition-transform duration-500">
                 <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-1 tracking-tight">Active Customers</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">Current branch demographic</p>
           </div>
           <div className="flex items-end justify-between mt-8">
              <span className="text-5xl font-black text-white tracking-tighter">{stats.activeCustomers}</span>
              <button className="p-3 bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                 <Users className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div 
          onClick={() => navigate('/employee/performance')}
          className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-500 cursor-pointer"
        >
           <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:rotate-12 transition-transform duration-500">
                 <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-1 tracking-tight">Total Processed</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">Lifecycle transaction volume</p>
           </div>
           <div className="flex items-end justify-between mt-8">
              <span className="text-5xl font-black text-white tracking-tighter">{stats.totalTransactions}</span>
              <button className="p-3 bg-emerald-600 rounded-xl text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                 <BarChart3 className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function KPIBox({ title, value, sub, trend, icon, color, onClick }: any) {
    const config: any = {
        indigo: { text: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'hover:border-indigo-500/50', accent: 'bg-indigo-500' },
        purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'hover:border-purple-500/50', accent: 'bg-purple-500' },
        emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'hover:border-emerald-500/50', accent: 'bg-emerald-500' },
        amber: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'hover:border-amber-500/50', accent: 'bg-amber-500' },
    };
    const style = config[color];

    return (
        <div 
          onClick={onClick}
          className={`bg-slate-900/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-800 transition-all duration-700 group cursor-pointer ${style.border}`}
        >
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl transition-all duration-700 ${style.bg} ${style.text} group-hover:scale-110 group-hover:rotate-6`}>
                    {React.cloneElement(icon, { className: 'w-7 h-7 shadow-[0_0_15px_rgba(var(--tw-gradient-stops),0.4)]' })}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-700 font-black tracking-widest uppercase">REAL-TIME</span>
                    <div className="h-1 w-6 bg-slate-800 rounded-full mt-1 group-hover:w-10 transition-all duration-700"></div>
                </div>
            </div>
            <div>
                <h3 className="text-4xl font-black text-white mb-2 leading-none tracking-tighter group-hover:tracking-normal transition-all duration-700">{value}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{title}</p>
                <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'} text-[10px] font-black font-mono`}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {sub}
                    </div>
                </div>
            </div>
        </div>
    );
}
