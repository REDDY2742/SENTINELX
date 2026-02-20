import { 
  CreditCard, IndianRupee, Search, Users,
  TrendingUp, FileText
} from 'lucide-react';

export default function StaffPayroll() {
  const payrolls = [
    { id: 'PAY-JAN-01', staff: 'Suhasini Reddy', gross: '₹85,000', net: '₹72,400', status: 'Disbursed', date: '31 Jan' },
    { id: 'PAY-JAN-02', staff: 'Arun Kumar', gross: '₹68,000', net: '₹58,200', status: 'Disbursed', date: '31 Jan' },
    { id: 'PAY-JAN-03', staff: 'Priya Mehta', gross: '₹72,500', net: '₹61,800', status: 'Processing', date: '01 Feb' },
    { id: 'PAY-JAN-04', staff: 'Vikas Khanna', gross: '₹45,000', net: '₹38,500', status: 'Scheduled', date: '05 Feb' },
    { id: 'PAY-JAN-05', staff: 'Neha Singh', gross: '₹52,000', net: '₹44,300', status: 'Scheduled', date: '05 Feb' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                  <CreditCard className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Financial Disbursements</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage staff payroll, salary structures, and tax withholdings</p>
              </div>
          </div>
          <div className="flex gap-3">
              <button className="bg-slate-900 border border-slate-800 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Download slips</button>
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all">Initiate cycle</button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Monthly Liability', value: '₹12.4L', sub: 'Feb 2024 Cycle', trend: 'up', icon: IndianRupee },
            { label: 'Staff Enrolled', value: '24 Members', sub: '14 Depts', trend: 'neutral', icon: Users },
            { label: 'Avg Payout', value: '₹52,800', sub: '+4% vs Last Year', trend: 'up', icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 group">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-emerald-400 transition-colors"><stat.icon className="w-6 h-6" /></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{stat.sub}</p>
            </div>
          ))}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input placeholder="Filter by Staff Name or Pay ID..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all" />
               </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full">
                  <thead>
                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                          <th className="text-left px-6 py-4">Transaction ID</th>
                          <th className="text-left px-6 py-4">Employee</th>
                          <th className="text-right px-6 py-4">Gross Pay</th>
                          <th className="text-right px-6 py-4">Net Payout</th>
                          <th className="text-center px-6 py-4">Status</th>
                          <th className="text-right px-6 py-4">Pay Date</th>
                          <th className="w-10"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                      {payrolls.map((p) => (
                        <tr key={p.id} className="group hover:bg-slate-800/20 transition-all duration-300">
                            <td className="px-6 py-5">
                                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">{p.id}</span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px] font-black text-emerald-400 border border-emerald-500/20">{p.staff.charAt(0)}</div>
                                    <span className="text-sm font-bold text-slate-200">{p.staff}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right font-medium text-slate-400">
                                {p.gross}
                            </td>
                            <td className="px-6 py-5 text-right font-black text-white">
                                {p.net}
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                    p.status === 'Disbursed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                    p.status === 'Processing' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                    'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                }`}>
                                    {p.status}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right font-mono text-[11px] text-slate-500">
                                {p.date}
                            </td>
                            <td className="px-6 py-5 text-right">
                                <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all">
                                    <FileText className="w-4 h-4" />
                                </button>
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
