import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar } from 'recharts';

const PERFORMANCE_DATA = [
  { name: 'Jan', revenue: 4000, new_customers: 24, loans: 12 },
  { name: 'Feb', revenue: 3000, new_customers: 13, loans: 8 },
  { name: 'Mar', revenue: 2000, new_customers: 98, loans: 2 },
  { name: 'Apr', revenue: 2780, new_customers: 39, loans: 6 },
  { name: 'May', revenue: 1890, new_customers: 48, loans: 10 },
  { name: 'Jun', revenue: 2390, new_customers: 38, loans: 5 },
  { name: 'Jul', revenue: 3490, new_customers: 43, loans: 14 },
];

export default function BranchPerformance() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight">Branch Performance</h1>
             <p className="text-slate-400 text-sm mt-1">Analytics for New York - Downtown Branch (BR-8821).</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-sm text-slate-400">Branch Rank</div>
                <div className="text-emerald-400 font-bold text-xl">Top 5%</div>
             </div>
             <div className="w-px h-10 bg-slate-800"></div>
             <div className="text-right">
                <div className="text-sm text-slate-400">Branch Score</div>
                <div className="text-indigo-400 font-bold text-xl">94/100</div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Deposits" value="$14.2M" sub="+8% MoM" icon={<DollarSign className="text-emerald-400" />} />
          <StatCard title="Loan Portfolio" value="$8.5M" sub="+12% MoM" icon={<TrendingUp className="text-blue-400" />} />
          <StatCard title="New Accounts" value="1,240" sub="+5% MoM" icon={<Users className="text-indigo-400" />} />
          <StatCard title="NPA Ratio" value="0.8%" sub="-0.1% (Good)" icon={<Activity className="text-emerald-400" />} />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-80">
             <h3 className="font-bold text-white mb-6">Revenue Growth</h3>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                   <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <XAxis dataKey="name" stroke="#64748b" />
                   <YAxis stroke="#64748b" />
                   <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                   <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-80">
             <h3 className="font-bold text-white mb-6">Customer Acquisition</h3>
             <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={PERFORMANCE_DATA}>
                   <XAxis dataKey="name" stroke="#64748b" />
                   <YAxis stroke="#64748b" />
                   <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                   <Bar dataKey="new_customers" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </ReBarChart>
             </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) {
   return (
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition">
         <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</span>
            {icon}
         </div>
         <div className="text-3xl font-light text-white mb-1">{value}</div>
         <div className={`text-xs font-mono font-bold ${sub.includes('-') ? 'text-red-400' : 'text-emerald-400'}`}>{sub}</div>
      </div>
   )
}
