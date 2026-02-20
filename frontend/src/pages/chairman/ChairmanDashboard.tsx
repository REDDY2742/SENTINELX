import React, { useState } from 'react';
import { TrendingUp, Globe, Briefcase, DollarSign, Activity, PieChart, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock Data
const REVENUE_DATA = [
  { name: 'Jan', value: 4000, risk: 2400 },
  { name: 'Feb', value: 3000, risk: 1398 },
  { name: 'Mar', value: 2000, risk: 9800 },
  { name: 'Apr', value: 2780, risk: 3908 },
  { name: 'May', value: 1890, risk: 4800 },
  { name: 'Jun', value: 2390, risk: 3800 },
  { name: 'Jul', value: 3490, risk: 4300 },
];

export default function ChairmanDashboard() {
  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Sidebar role="Executive" />
      <main className="flex-1 p-8 ml-64">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-wide">Executive Overview</h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Global Performance · Q3 2026</p>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
                <div className="text-sm text-slate-400">Net Asset Value</div>
                <div className="text-xl font-medium text-emerald-400">$45.2B</div>
             </div>
             <div className="w-px bg-slate-800 h-10"></div>
             <div className="text-right">
                <div className="text-sm text-slate-400">Stock Price (SNTL)</div>
                <div className="text-xl font-medium text-indigo-400">$142.50</div>
             </div>
          </div>
        </header>

        {/* Executive KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ExecCard title="Total Revenue" value="$8.2B" sub="+12% YoY" icon={<DollarSign className="text-emerald-400" />} />
            <ExecCard title="Active Customers" value="14.2M" sub="+5% QoQ" icon={<Globe className="text-blue-400" />} />
            <ExecCard title="Fraud Loss Ratio" value="0.02%" sub="-0.01% (Improving)" icon={<AlertTriangle className="text-amber-400" />} />
            <ExecCard title="OpEx Efficiency" value="92%" sub="Target: 95%" icon={<Activity className="text-purple-400" />} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-96">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Revenue Growth vs Risk
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#475569" />
                        <YAxis stroke="#475569" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                        <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
                        <Area type="monotone" dataKey="risk" stroke="#f43f5e" fillOpacity={0} strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-500" />
                    Regional Performance
                </h3>
                <div className="space-y-4">
                    <RegionRow region="North America" amt="4.2B" growth="+8%" />
                    <RegionRow region="Europe (EMEA)" amt="2.1B" growth="+12%" />
                    <RegionRow region="Asia Pacific" amt="1.5B" growth="+24%" highlight />
                    <RegionRow region="Latin America" amt="0.4B" growth="+5%" />
                </div>
            </div>
        </div>
      </main>
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
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition">
            <div className="flex justify-between items-start mb-4">
               <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</span>
               {icon}
            </div>
            <div className="text-3xl font-light text-white mb-1">{value}</div>
            <div className="text-xs font-mono text-slate-400">{sub}</div>
        </div>
    )
}

function Sidebar({ role }: { role: string }) {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-900 p-6 flex flex-col z-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 border border-indigo-500 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
           <div className="text-lg font-light tracking-wide text-white">
             SENTINEL
           </div>
           <div className="text-[10px] text-indigo-500 font-bold tracking-[0.2em] uppercase">Group Holdings</div>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        <NavItem icon={<PieChart />} label="Global Overview" active />
        <NavItem icon={<TrendingUp />} label="Market Trends" />
        <NavItem icon={<Globe />} label="Regional Ops" />
        <NavItem icon={<Activity />} label="Risk Control" />
      </div>

       <div className="px-4 py-4 mt-auto rounded-xl bg-gradient-to-br from-slate-900 to-black border border-slate-800">
           <div className="text-xs text-slate-500 mb-2">Authenticated as</div>
           <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-slate-700 block" />
               <div className="text-sm font-medium">Chairman</div>
           </div>
       </div>
    </nav>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
      active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300'
    }`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
  );
}
