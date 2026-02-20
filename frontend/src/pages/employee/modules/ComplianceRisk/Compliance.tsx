import { 
  ShieldAlert, ShieldCheck, Globe, FileWarning,
  ArrowUpRight, ExternalLink, BarChart3
} from 'lucide-react';

export default function ComplianceRisk() {
  const alerts = [
    { id: 'AML-042', customer: 'Vikas Khanna', risk: 'High', type: 'Structuring', time: '12m ago', score: 88 },
    { id: 'KYC-881', customer: 'Anjali Gupta', risk: 'Medium', type: 'Mismatch', time: '45m ago', score: 54 },
    { id: 'STR-001', customer: 'Global Exports', risk: 'Critical', type: 'Offshore Transfer', time: '2h ago', score: 95 },
    { id: 'COMP-110', customer: 'Rahul Sharma', risk: 'Low', type: 'Missing Doc', time: '5h ago', score: 22 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                  <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Compliance Monitoring</h2>
                  <p className="text-slate-500 text-sm mt-1">AML alerts, KYC compliance, and regulatory risk scores</p>
              </div>
          </div>
          <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-inner">
             <button className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/20">Critical Alerts</button>
             <button className="px-6 py-2.5 text-slate-500 hover:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cleared</button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-3"><Globe className="w-4 h-4 text-rose-400" /> Active AML Alerts</h3>
                  <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="group bg-slate-950/50 border border-slate-800 hover:border-rose-500/30 rounded-3xl p-6 transition-all duration-300">
                            <div className="grid grid-cols-4 items-center gap-6">
                                <div className="col-span-1">
                                    <div className="text-[10px] font-mono text-slate-500 mb-1">{alert.id}</div>
                                    <div className="text-xs font-bold text-white">{alert.customer}</div>
                                </div>
                                <div className="col-span-1">
                                    <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Alert Type</div>
                                    <div className="text-[11px] font-bold text-slate-300">{alert.type}</div>
                                </div>
                                <div className="col-span-1 text-center">
                                    <div className={`text-[10px] font-black uppercase mb-1 ${
                                        alert.risk === 'Critical' ? 'text-rose-500' :
                                        alert.risk === 'High' ? 'text-amber-500' : 'text-indigo-400'
                                    }`}>{alert.risk} Risk</div>
                                    <div className="h-1.5 w-16 bg-slate-900 rounded-full mx-auto overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${
                                            alert.risk === 'Critical' ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' :
                                            alert.risk === 'High' ? 'bg-amber-500' : 'bg-indigo-500'
                                        }`} style={{ width: `${alert.score}%` }}></div>
                                    </div>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button className="p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-500 hover:text-indigo-400 transition-all">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[2rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-16 h-16" /></div>
                      <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">KYC Compliance</h4>
                      <div className="text-3xl font-black text-white mb-2">94.2%</div>
                      <p className="text-xs text-emerald-500/80 font-medium leading-relaxed">Branch is above the regional threshold for document precision.</p>
                  </div>
                  <div className="bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[2rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BarChart3 className="w-16 h-16" /></div>
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Risk Exposure</h4>
                      <div className="text-3xl font-black text-white mb-2">Modest</div>
                      <p className="text-xs text-indigo-400/80 font-medium leading-relaxed">No high-risk offshore exposure detected in today's intra-day cycle.</p>
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
                  <h3 className="text-sm font-bold text-white mb-8 border-b border-slate-800/50 pb-4">Internal Policy</h3>
                  <div className="space-y-6">
                      {[
                        { title: 'STX-2024 V2', desc: 'Updated AML guidelines for digital assets.', status: 'Applied' },
                        { title: 'KYC Delta', desc: 'New requirement for biometric re-auth every 2 years.', status: 'Pending' },
                      ].map((p, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-200">{p.title}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{p.status}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">{p.desc}</p>
                        </div>
                      ))}
                  </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 p-8 rounded-[2.5rem] space-y-4">
                  <div className="flex items-center gap-3">
                      <FileWarning className="w-6 h-6 text-amber-500" />
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">Audit Notice</h4>
                  </div>
                  <p className="text-[10px] text-amber-500/80 leading-relaxed font-bold uppercase">Quarterly compliance audit scheduled for next Monday. please ensure all physical vouchers are reconciled.</p>
                  <button className="text-[10px] font-black text-amber-500 flex items-center gap-2 hover:translate-x-1 transition-transform">VIEW PRE-AUDIT CHECKLIST <ExternalLink className="w-3 h-3" /></button>
              </div>
          </div>
      </div>
    </div>
  );
}
