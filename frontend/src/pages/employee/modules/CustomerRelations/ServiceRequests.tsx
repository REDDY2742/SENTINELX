import { 
  Search, ArrowRight, ShieldAlert, CreditCard,
  FileText, MessageSquare
} from 'lucide-react';

export default function ServiceRequests() {
  const requests = [
    { id: 'SR-2021', type: 'ATM Card Blocking', customer: 'Vikas Khanna', status: 'new', priority: 'critical', time: '5m ago' },
    { id: 'SR-2022', type: 'Address Update', customer: 'Suhasini Reddy', status: 'processing', priority: 'medium', time: '12m ago' },
    { id: 'SR-2023', type: 'Statement Retrieval', customer: 'Rahul Gupta', status: 'completed', priority: 'low', time: '45m ago' },
    { id: 'SR-2024', type: 'Nominee Addition', customer: 'Anjali Gupta', status: 'new', priority: 'medium', time: '2h ago' },
    { id: 'SR-2025', type: 'Checkbook Issue', customer: 'Global Exports', status: 'processing', priority: 'high', time: '3h ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Service Request Desk</h2>
              <p className="text-slate-500 text-sm mt-1">Manage and fulfill customer-centric banking requests</p>
          </div>
          <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5 px-4 items-center gap-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filters:</span>
              <button className="text-[10px] font-bold text-indigo-400">All Open</button>
              <button className="text-[10px] font-bold text-slate-500 hover:text-white transition-all">My Tickets</button>
              <button className="text-[10px] font-bold text-slate-500 hover:text-white transition-all">Closed</button>
          </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden">
           <div className="flex gap-4 mb-8">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input placeholder="Search Request ID or Name..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500/50" />
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {requests.map((sr) => (
                 <div key={sr.id} className="bg-slate-950/50 border border-slate-800 rounded-[2rem] p-6 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-2 rounded-xl border ${
                            sr.status === 'new' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                            sr.status === 'processing' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' :
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                            {sr.type.includes('Card') ? <CreditCard className="w-5 h-5" /> : 
                             sr.type.includes('Update') || sr.type.includes('Nominee') ? <FileText className="w-5 h-5" /> :
                             <MessageSquare className="w-5 h-5" />}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                            sr.priority === 'critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                            sr.priority === 'high' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                            'bg-slate-500/10 border-slate-500/20 text-slate-500'
                        }`}>
                            {sr.priority}
                        </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">{sr.type}</h3>
                    <p className="text-[11px] text-slate-500 font-medium mb-6">Customer: <span className="text-slate-300">{sr.customer}</span></p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-slate-600">{sr.id}</span>
                            <span className="text-[9px] text-indigo-400 font-bold uppercase mt-0.5">{sr.time}</span>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-all">
                            Process <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {sr.priority === 'critical' && (
                       <div className="absolute top-0 right-0 p-2"><ShieldAlert className="w-4 h-4 text-rose-500/20" /></div>
                    )}
                 </div>
               ))}
           </div>
      </div>
    </div>
  );
}

