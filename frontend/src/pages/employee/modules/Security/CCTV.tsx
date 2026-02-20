import { 
  Camera, Clock, Activity, Maximize2,
  RefreshCw, Power, AlertTriangle
} from 'lucide-react';

export default function SecurityCCTV() {
  const feeds = [
    { id: 'CAM-01', location: 'Main Entrance (External)', status: 'Live', risk: 'Low' },
    { id: 'CAM-02', location: 'Main Entrance (Internal)', status: 'Live', risk: 'Low' },
    { id: 'CAM-03', location: 'Teller Section 1-4', status: 'Live', risk: 'Medium' },
    { id: 'CAM-04', location: 'Cash Vault Area (Restricted)', status: 'Live', risk: 'Low' },
    { id: 'CAM-05', location: 'Employee Lounge', status: 'Live', risk: 'Low' },
    { id: 'CAM-06', location: 'ATM Vestibule (External)', status: 'Live', risk: 'High' },
    { id: 'CAM-07', location: 'Branch Manager Cabin', status: 'Live', risk: 'Low' },
    { id: 'CAM-08', location: 'Server Room (Restricted)', status: 'Live', risk: 'Low' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                  <Camera className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Security Surveillance</h2>
                  <p className="text-slate-500 text-sm mt-1">Real-time CCTV infrastructure and perimeter monitoring</p>
              </div>
          </div>
          <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-inner">
             <button className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/20">Live Grid</button>
             <button className="px-6 py-2.5 text-slate-500 hover:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Playback</button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 overflow-hidden group">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800/50 pb-4">Security Status</h3>
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">Armed Status</span>
                          <span className="text-[10px] font-black text-emerald-500 uppercase">Secured</span>
                      </div>
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">Network Latency</span>
                          <span className="text-[10px] font-black text-indigo-400 uppercase">12ms (Stable)</span>
                      </div>
                      <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">Storage Ret.</span>
                          <span className="text-[10px] font-black text-slate-300 uppercase">28 Days Left</span>
                      </div>
                  </div>
                  
                  <div className="mt-10 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-3 mb-3">
                          <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Motion Events</span>
                      </div>
                      <div className="space-y-3">
                          <p className="text-[9px] text-slate-500 leading-relaxed font-medium">CAM-06: Movement detected in ATM Vestibule at 02:42 AM.</p>
                          <p className="text-[9px] text-slate-500 leading-relaxed font-medium">CAM-01: Shift change logged at 06:00 AM.</p>
                      </div>
                  </div>
              </div>

              <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 space-y-4">
                  <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Panic System</h4>
                  </div>
                  <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-rose-600/30 active:scale-95 transition-all">Trigger Alert</button>
                  <p className="text-[8px] text-rose-500 text-center font-bold uppercase">AUTHORIZED PERSONNEL ONLY</p>
              </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {feeds.map((cam) => (
                <div key={cam.id} className="group bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden relative transition-all hover:border-rose-500/30">
                    <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Static/Grain Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWU0WMrfi/giphy.gif')] bg-cover"></div>
                        
                        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                            <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shadow-[0_0_8px_rgba(225,29,72,1)]"></div>
                            <span className="text-[10px] font-black text-white/50 tracking-widest uppercase">{cam.id}</span>
                        </div>
                        
                        {/* Scanning Line Animation */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-scan-slow z-10"></div>
                        
                        <Activity className="w-8 h-8 text-slate-800" />
                        
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="flex gap-2">
                                 <button className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-white/80 hover:text-white transition-all"><Maximize2 className="w-3.5 h-3.5" /></button>
                                 <button className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-white/80 hover:text-white transition-all"><RefreshCw className="w-3.5 h-3.5" /></button>
                             </div>
                             <button className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-rose-500 hover:bg-rose-600 hover:text-white transition-all"><Power className="w-3.5 h-3.5" /></button>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-1">
                             <h4 className="text-xs font-bold text-white tracking-tight">{cam.location}</h4>
                             <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                                 cam.risk === 'High' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                 cam.risk === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                             }`}>{cam.risk} RISK</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                            <Clock className="w-3 h-3" /> Real-time Feed
                        </div>
                    </div>
                </div>
              ))}
          </div>
      </div>
    </div>
  );
}
