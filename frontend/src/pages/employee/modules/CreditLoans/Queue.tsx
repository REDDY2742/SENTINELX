import { 
  BarChart3, Clock,
  Search, IndianRupee,
  History, ArrowUpRight
} from 'lucide-react';

export default function LoanAppraisalQueue() {
  const applications = [
    { id: 'LN-8801', name: 'Sandeep Reddy', status: 'In Review', type: 'Personal', amount: '₹12,50,000', node: 'Branch Manager', time: '12m ago' },
    { id: 'LN-8798', name: 'Monica Sharma', status: 'Pending Info', type: 'Business', amount: '₹45,00,000', node: 'Credit Officer', time: '2h ago' },
    { id: 'LN-8795', name: 'Rahul Gupta', status: 'Approved', type: 'Vehicle', amount: '₹8,50,000', node: 'Disbursement', time: '5h ago' },
    { id: 'LN-8805', name: 'Priya Verma', status: 'Disbursed', type: 'Gold Loan', amount: '₹2,10,000', node: 'Completed', time: 'Yesterday' },
    { id: 'LN-8809', name: 'Amit Singh', status: 'Rejected', type: 'Personal', amount: '₹5,00,000', node: 'Closed', time: '2 days ago' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Disbursed': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'In Review': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Appraisal Lifecycle</h2>
              <p className="text-slate-500 text-sm mt-1">Track and manage loan applications through the approval pipeline</p>
          </div>
          <div className="flex items-center gap-3">
              <button className="bg-slate-900 border border-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                 <History className="w-4 h-4" /> Pipeline History
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Avg Approval Time', value: '4.2 Days', trend: '-12%', icon: Clock },
            { label: 'Conversion Rate', value: '68%', trend: '+5%', icon: ArrowUpRight },
            { label: 'Active Pipeline', value: '142 Apps', trend: '+15', icon: BarChart3 },
            { label: 'Month Disbursed', value: '₹4.2 Cr', trend: '+8%', icon: IndianRupee },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 group transition-all hover:border-indigo-500/30">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-indigo-400 transition-colors"><stat.icon className="w-5 h-5" /></div>
                    <span className="text-[10px] font-black text-emerald-500">{stat.trend}</span>
                </div>
                <div className="text-2xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input placeholder="Filter by App ID or Name..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
               </div>
               <div className="flex gap-2">
                   {['All', 'In Review', 'Approved', 'Rejected'].map(f => (
                     <button key={f} className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">{f}</button>
                   ))}
               </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full">
                  <thead>
                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                          <th className="text-left px-6 py-4">Application</th>
                          <th className="text-left px-6 py-4">Customer</th>
                          <th className="text-left px-6 py-4">Type</th>
                          <th className="text-right px-6 py-4">Loan Amount</th>
                          <th className="text-center px-6 py-4">Current Node</th>
                          <th className="text-center px-6 py-4">Status</th>
                          <th className="text-right px-6 py-4">Last Update</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                      {applications.map((app) => (
                        <tr key={app.id} className="group hover:bg-slate-800/20 transition-all duration-300">
                            <td className="px-6 py-4">
                                <span className="text-sm font-mono font-bold text-slate-300 underline decoration-indigo-500/50 underline-offset-4">{app.id}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/20">{app.name.charAt(0)}</div>
                                    <span className="text-xs font-bold text-slate-200">{app.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{app.type}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-sm font-black text-white">{app.amount}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/5 px-2 py-1 rounded border border-indigo-400/20">{app.node}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(app.status)}`}>
                                    {app.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="text-xs font-bold text-slate-500">{app.time}</span>
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
