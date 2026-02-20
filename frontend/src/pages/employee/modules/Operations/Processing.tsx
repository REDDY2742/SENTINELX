import { 
  Workflow, Search, Clock, 
  Layers, Zap, Info,
  ExternalLink, MoreHorizontal
} from 'lucide-react';

export default function AccountProcessing() {
  const queue = [
    { id: 'PROC-901', type: 'Savings Account', customer: 'Sandeep Reddy', node: 'Compliance Check', progress: 65, time: '12m ago' },
    { id: 'PROC-902', type: 'Current Account', customer: 'Blue Horizon Ltd', node: 'Bank Verification', progress: 40, time: '28m ago' },
    { id: 'PROC-903', type: 'Fixed Deposit', customer: 'Anjali Gupta', node: 'Final Approval', progress: 90, time: '1h ago' },
    { id: 'PROC-904', type: 'Corporate Credit', customer: 'Global Logistics', node: 'Risk Scoring', progress: 20, time: '3h ago' },
    { id: 'PROC-905', type: 'Locker Rental', customer: 'Vikas Khanna', node: 'Identity Check', progress: 10, time: '5h ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <Workflow className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Operations Pipeline</h2>
                  <p className="text-slate-500 text-sm mt-1">Back-office processing for account lifecycle events</p>
              </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Auto-Processing: ON</span>
          </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
           <div className="flex gap-4 mb-10">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input placeholder="Search Job ID or Customer..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-indigo-500 transition-all" />
               </div>
           </div>

           <div className="space-y-4">
               {queue.map((item) => (
                 <div key={item.id} className="group bg-slate-950/40 border border-slate-800 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                        <div className="lg:col-span-2">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500"><Layers className="w-5 h-5" /></div>
                                 <div>
                                     <h4 className="text-sm font-bold text-white">{item.type}</h4>
                                     <p className="text-[10px] font-mono text-slate-500 mt-0.5">{item.id} • {item.customer}</p>
                                 </div>
                             </div>
                        </div>
                        
                        <div className="lg:col-span-2">
                             <div className="flex flex-col gap-2">
                                 <div className="flex justify-between text-[10px] uppercase font-black tracking-widest">
                                     <span className="text-indigo-400">{item.node}</span>
                                     <span className="text-slate-500">{item.progress}%</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000" style={{ width: `${item.progress}%` }}></div>
                                 </div>
                             </div>
                        </div>

                        <div className="lg:col-span-1 text-center">
                             <span className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-2">
                                 <Clock className="w-3 h-3 text-amber-500" /> {item.time}
                             </span>
                        </div>

                        <div className="lg:col-span-1 flex justify-end gap-2">
                             <button className="p-2 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
                             <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Attend</button>
                        </div>
                    </div>
                 </div>
               ))}
           </div>
           
           <div className="mt-10 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
               <div className="flex gap-4 items-center">
                   <Info className="w-5 h-5 text-indigo-400" />
                   <p className="text-xs text-indigo-300 font-medium">There are 12 more background jobs being handled by the STX-Auto Engine.</p>
               </div>
               <button className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">Monitor Engine <ExternalLink className="w-3.5 h-3.5" /></button>
           </div>
      </div>
    </div>
  );
}
