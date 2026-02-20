import { 
  Wallet, Banknote, ArrowUpRight, 
  ArrowDownLeft, AlertTriangle, Printer, 
  RefreshCw, TrendingUp
} from 'lucide-react';

export default function CashBalance() {
  const denominations = [
    { label: '₹2000', count: 450, total: '₹9,00,000' },
    { label: '₹500', count: 2100, total: '₹10,50,000' },
    { label: '₹200', count: 1200, total: '₹2,40,000' },
    { label: '₹100', count: 850, total: '₹85,000' },
    { label: '₹50', count: 400, total: '₹20,000' },
    { label: 'Coins', count: '-', total: '₹4,500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
          <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Vault & Till Status</h2>
              <p className="text-slate-500 text-sm mt-1">Real-time reconciliation of physical vs digital cash</p>
          </div>
          <div className="flex gap-3">
              <button className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
                  <RefreshCw className="w-5 h-5" />
              </button>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
                  <Printer className="w-5 h-5" /> Print Ledger
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                            <Wallet className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Current Till Balance</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-slate-500 font-mono">Last reconciled: 09:00 AM Today</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                    <div className="p-8 rounded-[2rem] bg-slate-950 border border-slate-800 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Closing Balance (Yesterday)</span>
                        <div className="text-3xl font-black text-slate-500 tracking-tighter">₹21,45,000.00</div>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-indigo-600 border border-indigo-400/20 shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4"><TrendingUp className="text-indigo-200/50 w-8 h-8" /></div>
                        <span className="block text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Target Reconciliation</span>
                        <div className="text-3xl font-black text-white tracking-tighter">₹23,04,520.00</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Inflow / Outflow Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500"><ArrowDownLeft className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-slate-400">Total Deposits</span>
                            </div>
                            <span className="text-emerald-400 font-black tracking-tight text-sm group-hover:scale-105 transition-transform">₹8,52,400</span>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center text-rose-500"><ArrowUpRight className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-slate-400">Total Withdrawals</span>
                            </div>
                            <span className="text-rose-400 font-black tracking-tight text-sm group-hover:scale-105 transition-transform">₹6,92,880</span>
                        </div>
                    </div>
                </div>
          </div>

          <div className="flex flex-col gap-6">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 flex-1">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Banknote className="w-5 h-5" /></div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Denominations</h4>
                    </div>
                    <div className="space-y-4">
                        {denominations.map((d, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-200 w-12">{d.label}</span>
                                    <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">x {d.count}</span>
                                </div>
                                <span className="text-xs font-black text-slate-300 font-mono">{d.total}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-amber-200 mb-1 leading-none">Limit Alert</p>
                        <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">Vault capacity reached 85%. Consider a cash movement to central chest soon.</p>
                    </div>
                </div>
          </div>
      </div>
    </div>
  );
}
