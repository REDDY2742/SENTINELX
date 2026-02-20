import { 
  IndianRupee, TrendingUp, TrendingDown, Search, Plus, 
  FileText, Clock, MoreVertical, BarChart3
} from 'lucide-react';

export default function BranchExpenses() {
  const expenses = [
    { id: 'EXP-491', category: 'Utilities', provider: 'BESCOM Electricity', amount: '₹14,500', status: 'Approved', date: 'Today' },
    { id: 'EXP-492', category: 'Stationery', provider: 'PrintPoint Solutions', amount: '₹4,200', status: 'Pending', date: 'Yesterday' },
    { id: 'EXP-493', category: 'Maintenance', provider: 'QuickFix HVAC', amount: '₹8,900', status: 'Approved', date: 'Yesterday' },
    { id: 'EXP-494', category: 'Travel', provider: 'Staff RE: Field visit', amount: '₹1,500', status: 'Approved', date: '02 Feb' },
    { id: 'EXP-495', category: 'Marketing', provider: 'Regional Ad Desk', amount: '₹22,000', status: 'Rejected', date: '30 Jan' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Expense Tracking</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage departmental spends and utility payables</p>
              </div>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
             <Plus className="w-5 h-5" /> Record Expense
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Weekly Spend', value: '₹42,500', sub: 'Budget: ₹50,000', trend: 'down', icon: IndianRupee },
            { label: 'Pending Approval', value: '₹12,400', sub: '4 Requests', trend: 'up', icon: Clock },
            { label: 'Yearly Burn Rate', value: '₹18.5L', sub: '92% of Forecast', trend: 'up', icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 group overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-indigo-400 transition-colors"><stat.icon className="w-6 h-6" /></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                        {stat.sub}
                    </span>
                </div>
            </div>
          ))}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input placeholder="Filter by Provider or Category..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium" />
               </div>
               <div className="flex gap-2">
                   {['All', 'Utilities', 'Stationery', 'Travel'].map(f => (
                     <button key={f} className="px-6 py-3 rounded-2xl border border-slate-800 bg-slate-950 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">{f}</button>
                   ))}
               </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          <th className="text-left px-6 py-2">Category</th>
                          <th className="text-left px-6 py-2">Vendor / Provider</th>
                          <th className="text-right px-6 py-2">Amount</th>
                          <th className="text-center px-6 py-2">Status</th>
                          <th className="text-right px-6 py-2">Date</th>
                          <th className="w-10"></th>
                      </tr>
                  </thead>
                  <tbody>
                      {expenses.map((exp) => (
                        <tr key={exp.id} className="group bg-slate-950/30 hover:bg-slate-800/20 transition-all duration-300">
                            <td className="px-6 py-5 rounded-l-3xl border-y border-l border-slate-800/30 group-hover:border-indigo-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><FileText className="w-4 h-4" /></div>
                                    <span className="text-xs font-bold text-slate-300">{exp.category}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 border-y border-slate-800/30 group-hover:border-indigo-500/20">
                                <span className="text-xs font-medium text-slate-400">{exp.provider}</span>
                            </td>
                            <td className="px-6 py-5 border-y border-slate-800/30 group-hover:border-indigo-500/20 text-right">
                                <span className="text-sm font-black text-white">{exp.amount}</span>
                            </td>
                            <td className="px-6 py-5 border-y border-slate-800/30 group-hover:border-indigo-500/20 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                    exp.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                    exp.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                }`}>
                                    {exp.status}
                                </span>
                            </td>
                            <td className="px-6 py-5 border-y border-slate-800/30 group-hover:border-indigo-500/20 text-right font-mono text-[11px] text-slate-500">
                                {exp.date}
                            </td>
                            <td className="px-6 py-5 rounded-r-3xl border-y border-r border-slate-800/30 group-hover:border-indigo-500/20 text-center">
                                <button className="p-1 hover:text-indigo-400 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                            </td>
                        </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
}
