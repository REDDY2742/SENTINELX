import React, { useState } from 'react';
import { TrendingUp, PieChart, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_DATA = [
  { name: '2020', value: 4000 },
  { name: '2021', value: 3000 },
  { name: '2022', value: 5000 },
  { name: '2023', value: 2780 },
  { name: '2024', value: 1890 },
  { name: '2025', value: 2390 },
  { name: '2026', value: 3490 },
];

export default function Investments() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
        Grow Your Wealth with Sentinel
      </h1>
      <p className="text-slate-400 mb-12 max-w-2xl text-lg">
        Smart investing requires the best tools. Track markets, analyze trends, and build your portfolio with our enterprise-grade platform.
      </p>
      
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl mb-12 h-96">
         <h2 className="flex items-center gap-3 text-xl font-semibold mb-6">
           <TrendingUp className="text-emerald-400" /> S&P 500 Performance
         </h2>
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={MOCK_DATA}>
             <defs>
               <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
               </linearGradient>
             </defs>
             <XAxis dataKey="name" stroke="#475569" />
             <YAxis stroke="#475569" />
             <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
             <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
           </AreaChart>
         </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
           <PieChart className="w-10 h-10 text-purple-400 mb-4" />
           <h3 className="text-2xl font-bold mb-2">Automated Portfolios</h3>
           <p className="text-slate-400">Let our AI build a diversified portfolio tailored to your risk tolerance.</p>
         </div>
         <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
           <Activity className="w-10 h-10 text-cyan-400 mb-4" />
           <h3 className="text-2xl font-bold mb-2">Real-Time Crypto</h3>
           <p className="text-slate-400">Trade Bitcoin, Ethereum, and over 50 other cryptocurrencies instantly.</p>
         </div>
      </div>
    </div>
  );
}
