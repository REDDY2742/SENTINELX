import { useState } from 'react';
import { 
  Search, ArrowUpRight, ArrowDownLeft, 
  ArrowLeftRight, Download, Clock
} from 'lucide-react';

export default function TransactionLogs() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const logs = [
    { id: 'TX-9102-8472', type: 'withdrawal', amount: '₹25,000.00', account: '•••• 1234', user: 'Sandeep Reddy', time: '09:45 AM', status: 'completed' },
    { id: 'TX-9102-8473', type: 'deposit', amount: '₹1,50,000.00', account: '•••• 5678', user: 'Suhasini Reddy', time: '10:12 AM', status: 'completed' },
    { id: 'TX-9102-8474', type: 'transfer', amount: '₹12,450.00', account: '•••• 9012', user: 'Rahul Sharma', time: '10:28 AM', status: 'completed' },
    { id: 'TX-9102-8475', type: 'withdrawal', amount: '₹5,000.00', account: '•••• 1122', user: 'Anjali Gupta', time: '10:55 AM', status: 'pending' },
    { id: 'TX-9102-8476', type: 'cheque', amount: '₹48,900.00', account: '•••• 3344', user: 'Vikas Khanna', time: '11:05 AM', status: 'clearing' },
    { id: 'TX-9102-8477', type: 'deposit', amount: '₹3,00,000.00', account: '•••• 5566', user: 'Priya Singh', time: '11:20 AM', status: 'completed' },
  ];

  const filteredLogs = logs.filter(log => {
     if (filter !== 'all' && log.type !== filter) return false;
     if (search && !log.id.toLowerCase().includes(search.toLowerCase()) && !log.user.toLowerCase().includes(search.toLowerCase())) return false;
     return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Daily Transaction Log</h2>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                 <Clock className="w-4 h-4" /> Today: February 14, 2026 • Live Feed
              </p>
          </div>
          <div className="flex items-center gap-3">
              <button className="bg-slate-900 border border-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <Download className="w-4 h-4" /> Export CSV
              </button>
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">
                  Print Summary
              </button>
          </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
           <div className="flex flex-col md:flex-row gap-4 mb-8">
               <div className="flex-1 relative group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-all" />
                   <input 
                     type="text" 
                     placeholder="Search by ID or Customer Name..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                   />
               </div>
               <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-800 rounded-2xl p-1.5">
                   {['all', 'deposit', 'withdrawal', 'transfer', 'cheque'].map(f => (
                       <button 
                         key={f}
                         onClick={() => setFilter(f)}
                         className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                           filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'
                         }`}
                       >
                         {f}
                       </button>
                   ))}
               </div>
           </div>

           <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                            <th className="text-left px-6 py-4">Transaction ID</th>
                            <th className="text-left px-6 py-4">Type</th>
                            <th className="text-left px-6 py-4">Customer</th>
                            <th className="text-right px-6 py-4">Amount</th>
                            <th className="text-center px-6 py-4">Status</th>
                            <th className="text-right px-6 py-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                        {filteredLogs.map((log) => (
                            <tr key={log.id} className="group hover:bg-slate-800/20 transition-all duration-300">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-mono text-slate-300 font-bold tracking-tight">{log.id}</div>
                                    <div className="text-[9px] text-slate-600 font-mono mt-0.5">{log.account}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            log.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 
                                            log.type === 'withdrawal' ? 'bg-rose-500/10 text-rose-500' :
                                            log.type === 'transfer' ? 'bg-indigo-500/10 text-indigo-500' :
                                            'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            {log.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : 
                                             log.type === 'withdrawal' ? <ArrowUpRight className="w-4 h-4" /> :
                                             log.type === 'transfer' ? <ArrowLeftRight className="w-4 h-4" /> :
                                             <ScrollText className="w-4 h-4" />}
                                        </div>
                                        <span className="text-xs font-bold text-slate-200 capitalize">{log.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-slate-200">{log.user}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className={`text-sm font-black tracking-tight ${
                                        log.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'
                                    }`}>{log.amount}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                        log.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                        log.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                        'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
                                    }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="text-xs font-bold text-slate-500">{log.time}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
           
           <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="text-xs text-slate-500 font-medium">Showing <span className="text-slate-300 font-bold">{filteredLogs.length}</span> entries today</div>
               <div className="flex items-center gap-2">
                   <button className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all disabled:opacity-30" disabled>Previous</button>
                   <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-bold">1</button>
                   <button className="w-8 h-8 rounded-lg border border-slate-800 text-slate-500 hover:text-white text-xs font-bold transition-all">2</button>
                   <button className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all">Next</button>
               </div>
           </div>
      </div>
    </div>
  );
}

function ScrollText(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll-text">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  );
}
