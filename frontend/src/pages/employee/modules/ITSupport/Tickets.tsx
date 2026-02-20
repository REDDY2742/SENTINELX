import { 
  LifeBuoy, Search, Plus, MessageSquare, 
  Terminal, ShieldCheck, Clock, 
  ChevronRight, AlertCircle, HardDrive
} from 'lucide-react';

export default function ITSupportTickets() {
  const tickets = [
    { id: 'TKT-101', subject: 'Cash Drawer Connectivity', dept: 'Cash & Vault', status: 'In Progress', priority: 'High', time: '12m ago' },
    { id: 'TKT-102', subject: 'Biometric Scanner Sync', dept: 'KYC Desk', status: 'Open', priority: 'High', time: '45m ago' },
    { id: 'TKT-103', subject: 'Slow Dashboard Loading', dept: 'Branch-wide', status: 'Resolved', priority: 'Low', time: '2h ago' },
    { id: 'TKT-104', subject: 'New Staff Access: Arun K', dept: 'Loans', status: 'Open', priority: 'Medium', time: '3h ago' },
    { id: 'TKT-105', subject: 'Passbook Printer Jam', dept: 'Customer Service', status: 'Resolved', priority: 'Medium', time: 'Yesterday' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <LifeBuoy className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Support Ticketing</h2>
                  <p className="text-slate-500 text-sm mt-1">Submit and track internal technical requests</p>
              </div>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
             <Plus className="w-5 h-5" /> Raise New Ticket
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800/50 pb-4">Hardware Status</h3>
                  <div className="space-y-6">
                      {[
                        { name: 'Branch Server', status: 'Online', icon: Terminal },
                        { name: 'Vault Connectivity', status: 'Secure', icon: ShieldCheck },
                        { name: 'Main Terminal', status: 'Running', icon: HardDrive },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-slate-400">
                                <item.icon className="w-4 h-4" />
                                <span className="text-xs font-bold">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider">
                                {item.status}
                            </div>
                        </div>
                      ))}
                  </div>
              </div>

              <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-indigo-400 shrink-0" />
                  <p className="text-[10px] text-indigo-400/80 leading-relaxed font-bold uppercase">System maintenance scheduled for tonight at 23:00 IST. Estimated downtime: 45 mins.</p>
              </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 mb-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input placeholder="Search Tickets..." className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner" />
                  </div>
              </div>

              <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="group bg-slate-950/50 border border-slate-800 hover:border-indigo-500/30 rounded-[2rem] p-6 transition-all duration-300 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-600 font-bold group-hover:text-indigo-400 transition-colors uppercase">{t.id}</span>
                                <h4 className="text-sm font-bold text-white">{t.subject}</h4>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                t.status === 'Resolved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                t.status === 'Open' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' :
                                'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            }`}>
                                {t.status}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t.dept}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold text-indigo-400">{t.time}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-black ${t.priority === 'High' ? 'text-rose-500' : 'text-slate-500'} uppercase tracking-widest`}>{t.priority} Priority</span>
                                <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:text-indigo-400 hover:border-indigo-500/50 transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
