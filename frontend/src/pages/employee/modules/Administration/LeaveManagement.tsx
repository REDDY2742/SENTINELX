import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, 
  User, Plus, Search,
  ArrowUpRight, Info, Loader2
} from 'lucide-react';

export default function LeaveManagement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/administration/leave', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setRequests(data.requests || []);
        setStats(data.stats || []);
      } catch (err) {
        console.error('Failed to fetch leave data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
                  <Calendar className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Leave Administration</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage staff absences, leave approvals and quota tracking</p>
              </div>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
             <Plus className="w-5 h-5" /> Submit Request
          </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Clock className="w-16 h-16 text-white" />
                </div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{s.label}</h4>
                <div className="text-4xl font-black text-white">{s.value}</div>
            </div>
          ))}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
           <div className="flex flex-col md:flex-row gap-4 mb-10">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input 
                     placeholder="Search Staff or Request ID..." 
                     className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
                   />
               </div>
           </div>

           <div className="space-y-4">
               {requests.map((item) => (
                 <div key={item.id} className="group bg-slate-950/40 border border-slate-800 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                        <div className="lg:col-span-2">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                     <User className="w-5 h-5" />
                                 </div>
                                 <div>
                                     <h4 className="text-sm font-bold text-white uppercase tracking-tight">{item.staff}</h4>
                                     <p className="text-[10px] font-mono text-slate-500 mt-0.5 uppercase">{item.id} • {item.type}</p>
                                 </div>
                             </div>
                        </div>
                        
                        <div className="lg:col-span-1">
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Duration</div>
                             <div className="text-sm font-bold text-white">{item.duration}</div>
                        </div>

                        <div className="lg:col-span-1">
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Starts</div>
                             <div className="text-sm font-bold text-indigo-400">{item.from}</div>
                        </div>

                        <div className="lg:col-span-1">
                             <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit ${
                                 item.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                             }`}>
                                 {item.status}
                             </div>
                        </div>

                        <div className="lg:col-span-1 flex justify-end gap-2">
                             {item.status === 'Pending' ? (
                               <>
                                 <button className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:shadow-rose-500/20">
                                   <XCircle className="w-4 h-4" />
                                 </button>
                                 <button className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20">
                                   <CheckCircle2 className="w-4 h-4" />
                                 </button>
                               </>
                             ) : (
                               <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all">
                                 <ArrowUpRight className="w-4 h-4" />
                               </button>
                             )}
                        </div>
                    </div>
                 </div>
               ))}
           </div>
           
           <div className="mt-10 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
               <div className="flex gap-4 items-center">
                   <Info className="w-5 h-5 text-indigo-400" />
                   <p className="text-xs text-indigo-300 font-medium">All leave cycles reset on April 1st as per the company fiscal policy.</p>
               </div>
               <button className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] border-b border-indigo-500/30 pb-0.5 hover:text-indigo-300 transition-colors">Policy Handbook</button>
           </div>
      </div>
    </div>
  );
}
