import { 
  FileSearch, Search, Download, 
  AlertTriangle, ClipboardCheck, ShieldCheck, ExternalLink
} from 'lucide-react';

export default function InternalAudit() {
  const reports = [
    { id: 'AUD-9021', type: 'Voucher Audit', scope: 'Cash & Vault', status: 'Flagged', findings: 3, time: 'Today' },
    { id: 'AUD-9022', type: 'KYC Document Audit', scope: 'Retail Banking', status: 'Clean', findings: 0, time: 'Yesterday' },
    { id: 'AUD-9023', type: 'Loan Appraisal Audit', scope: 'Credit & Loans', status: 'Clean', findings: 0, time: 'Yesterday' },
    { id: 'AUD-9024', type: 'IT Infrastructure', scope: 'IT Support', status: 'Action Req', findings: 1, time: '01 Feb' },
    { id: 'AUD-9025', type: 'Security Protocol', scope: 'Security', status: 'Clean', findings: 0, time: '30 Jan' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 text-amber-500">
                  <FileSearch className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Audit Intelligence</h2>
                  <p className="text-slate-500 text-sm mt-1">Review internal compliance findings and operational precision</p>
              </div>
          </div>
          <div className="flex gap-3">
              <button className="bg-slate-900 border border-slate-800 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Audit History</button>
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">New Audit Cycle</button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 overflow-hidden group">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800/50 pb-4">Compliance Score</h3>
                  <div className="flex items-center justify-center relative py-6">
                      <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-900" />
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-indigo-500" strokeDasharray="364.4" strokeDashoffset="43.7" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-white">88%</span>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Rank</span>
                      </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500">Target Level</span>
                          <span className="text-emerald-500">95%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500/50 w-[88%] rounded-full"></div>
                      </div>
                  </div>
              </div>

              <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                  <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Active Flags</h4>
                  </div>
                  <p className="text-[10px] text-amber-500 font-bold uppercase leading-relaxed">3 Vouchers in 'Cash & Vault' department require immediate physical reconciliation by CO-AUDITOR.</p>
              </div>
          </div>

          <div className="lg:col-span-3">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                      <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input placeholder="Filter reports..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all" />
                      </div>
                  </div>

                  <div className="space-y-4">
                      {reports.map((r) => (
                        <div key={r.id} className="group bg-slate-950/30 border border-slate-800 hover:border-indigo-500/30 rounded-3xl p-6 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                                        r.status === 'Clean' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                        r.status === 'Flagged' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                        'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                    }`}>
                                        <ClipboardCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{r.type}</h4>
                                        <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">{r.id} • {r.scope}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Findings</div>
                                        <div className={`text-xs font-black ${r.findings > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{r.findings} Items</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Last Update</div>
                                        <div className="text-xs font-bold text-slate-400">{r.time}</div>
                                    </div>
                                    <button className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all"><Download className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-10 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                          <ShieldCheck className="w-5 h-5 text-indigo-400" />
                          <p className="text-xs text-indigo-300 font-medium tracking-tight">System-wide data validation check completed at 06:00 IST. Integrity verified.</p>
                      </div>
                      <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">Protocol Logs <ExternalLink className="w-3.5 h-3.5" /></button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
