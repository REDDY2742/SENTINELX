import { 
  Search, Lock, Unlock, Key, 
  Users, ChevronRight, Activity, AlertTriangle
} from 'lucide-react';

export default function AccessControl() {
  const accessList = [
    { staff: 'Sandeep Reddy', role: 'Branch Manager', level: 'Level 5 (Admin)', status: 'active', auth: 'Fingerprint + Password' },
    { staff: 'Monica Sharma', role: 'Credit Officer', level: 'Level 3 (Manager)', status: 'active', auth: 'MFA + Password' },
    { staff: 'Rahul Gupta', role: 'Teller', level: 'Level 1 (Staff)', status: 'restricted', auth: 'Password' },
    { staff: 'Priya Verma', role: 'Relationship Manager', id: 'Level 2 (Staff)', status: 'active', auth: 'Fingerprint + MFA' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <Lock className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Identity & Access</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage system privileges and authentication protocols for branch staff</p>
              </div>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
             <Key className="w-5 h-5" /> Grant Temp Access
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 overflow-hidden group">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800/50 pb-4">Auth Performance</h3>
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">Success Rate</span>
                          <span className="text-[10px] font-black text-emerald-500 uppercase">99.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">Avg App Time</span>
                          <span className="text-[10px] font-black text-indigo-400 uppercase">0.8s</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400">MFA Adoption</span>
                         <span className="text-[10px] font-black text-amber-500 uppercase">82%</span>
                      </div>
                  </div>
              </div>

              <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                  <Activity className="w-6 h-6 text-indigo-400 shrink-0" />
                  <p className="text-[10px] text-indigo-400/80 leading-relaxed font-bold uppercase">System is monitoring for brute-force attempts. 0 suspicious events in last 24h.</p>
              </div>
          </div>

          <div className="lg:col-span-3">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8">
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                      <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input placeholder="Search personnel or access level..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium" />
                      </div>
                  </div>

                  <div className="space-y-4">
                      {accessList.map((item, i) => (
                        <div key={i} className="group bg-slate-950/40 border border-slate-800 hover:border-indigo-500/30 rounded-[2rem] p-6 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white tracking-tight">{item.staff}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{item.role}</p>
                                    </div>
                                </div>
                                
                                <div className="hidden xl:flex flex-col text-center">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Auth Method</span>
                                    <span className="text-[10px] font-bold text-slate-400">{item.auth}</span>
                                </div>

                                <div className="flex flex-col text-right">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Privilege Level</span>
                                    <span className="text-[10px] font-black text-indigo-400">{item.level}</span>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all"><Unlock className="w-4 h-4" /></button>
                                    <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-10 p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between text-rose-500/80">
                      <div className="flex gap-4 items-center">
                          <AlertTriangle className="w-5 h-5" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Master Lockdown Protocol: ENTER MASTER KEY TO INITIALIZE</p>
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-rose-500/50 pb-0.5">Initialize lockdown</button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
