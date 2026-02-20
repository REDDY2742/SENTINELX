import { useState } from 'react';
import { TrendingUp, TrendingDown, ShieldCheck, Loader2 } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

const data = [
  { name: 'Mutual Funds', value: 40000, color: '#6366f1' },
  { name: 'Fixed Deposits', value: 30000, color: '#10b981' },
  { name: 'Stocks', value: 15000, color: '#f59e0b' },
  { name: 'Gold', value: 5000, color: '#ec4899' },
];

export default function UserInvestments() {
  const [fdAmount, setFdAmount] = useState('10000');
  const [fdTenure, setFdTenure] = useState('12');
  const [investing, setInvesting] = useState(false);

  const applyFD = async () => {
    try {
      setInvesting(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/customer/apply', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'Fixed Deposit Opening',
          amount: parseInt(fdAmount),
          priority: 'low',
          details: `Tenure: ${fdTenure} Months, Maturity: ₹${maturityAmount.toFixed(2)}`
        })
      });
      
      if (response.ok) {
        toast.success(`FD Application of ₹${fdAmount} submitted`);
      }
    } catch (err) {
      toast.error('Failed to process investment');
    } finally {
      setInvesting(false);
    }
  };

  const interestRate = 6.5; // Dummy rate
  const maturityAmount = parseFloat(fdAmount) + (parseFloat(fdAmount) * interestRate * parseInt(fdTenure)) / 1200;

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
         <p className="text-slate-400">Track your wealth and grow your investments.</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-6">Asset Allocation</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
               <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie
                           data={data}
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                           ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                           itemStyle={{ color: '#fff' }}
                        />
                     </RePieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex-1 space-y-4">
                  {data.map((item) => (
                     <div key={item.name} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                           <span className="text-slate-300 font-medium">{item.name}</span>
                        </div>
                        <span className="text-white font-mono font-bold">₹{item.value.toLocaleString('en-IN')}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h3 className="text-emerald-100 font-medium mb-1">Total Returns</h3>
                <p className="text-3xl font-bold mb-4">+₹12,450.00</p>
                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                   <TrendingUp className="w-3 h-3" /> +15.4% All Time
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Market Watch</h3>
                <div className="space-y-3">
                   <MarketItem name="S&P 500" value="4,120.50" change="+1.2%" up />
                   <MarketItem name="NASDAQ" value="12,450.20" change="-0.5%" />
                   <MarketItem name="Gold" value="1,950.00" change="+0.8%" up />
                </div>
            </div>
         </div>
      </div>

      {/* FD Calculator / Creation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
               <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-500" /> Open Fixed Deposit
               </h3>
               <p className="text-slate-400 text-sm">Guaranteed returns up to 7.5% p.a.</p>
            </div>
            <button 
               onClick={applyFD}
               disabled={investing}
               className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
            >
               {investing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
               {investing ? 'Processing...' : 'Invest Now'}
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Deposit Amount (₹)</label>
                  <input 
                     type="number" 
                     value={fdAmount}
                     onChange={(e) => setFdAmount(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-lg outline-none focus:border-indigo-500 transition font-mono"
                  />
                  <input 
                     type="range" 
                     min="1000" 
                     max="100000" 
                     step="1000"
                     value={fdAmount}
                     onChange={(e) => setFdAmount(e.target.value)}
                     className="w-full mt-4 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tenure (Months)</label>
                  <div className="flex gap-2">
                     {[6, 12, 24, 60].map(m => (
                        <button 
                           key={m}
                           onClick={() => setFdTenure(m.toString())}
                           className={`flex-1 py-2 rounded-lg border transition ${fdTenure === m.toString() ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-indigo-500'}`}
                        >
                           {m}M
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <h4 className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-6">Maturity Comparison</h4>
               
               <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300">Investment Amount</span>
                  <span className="text-white font-mono font-bold">₹{parseInt(fdAmount).toLocaleString('en-IN')}</span>
               </div>
               <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300">Interest Rate</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded text-xs">{interestRate}% p.a.</span>
               </div>
               <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-slate-300 font-bold">Maturity Value</span>
                  <span className="text-2xl text-white font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                     ₹{maturityAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function MarketItem({ name, value, change, up }: { name: string, value: string, change: string, up?: boolean }) {
   return (
      <div className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg">
         <span className="text-slate-300 font-medium">{name}</span>
         <div className="text-right">
            <div className="text-white font-mono font-bold text-sm">₹{value}</div>
            <div className={`text-xs flex items-center justify-end gap-1 ${up ? 'text-emerald-500' : 'text-red-500'}`}>
               {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
               {change}
            </div>
         </div>
      </div>
   )
}
