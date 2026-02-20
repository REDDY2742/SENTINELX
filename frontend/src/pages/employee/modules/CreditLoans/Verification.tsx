import { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, AlertCircle,
  Eye, Download, ClipboardList, Clock, Briefcase
} from 'lucide-react';

export default function LoanVerification() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const applications = [
    { id: 'LN-8801', name: 'Sandeep Reddy', status: 'pending_verify', product: 'Personal Loan', amount: '₹12.5L', score: 785 },
    { id: 'LN-8802', name: 'Anushree Sharma', status: 'pending_verify', product: 'Home Loan', amount: '₹45.0L', score: 712 },
    { id: 'LN-8803', name: 'Raj Kumar', status: 'pending_verify', product: 'Gold Loan', amount: '₹2.4L', score: null },
    { id: 'LN-8804', name: 'Pooja Singh', status: 'verification_failed', product: 'Vehicle Loan', amount: '₹8.9L', score: 620 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
          <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Post-Application Verification</h2>
              <p className="text-slate-500 text-sm mt-1">Cross-verify documents and field reports before final appraisal</p>
          </div>
          <div className="flex items-center gap-3">
              <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Incoming</button>
                  <button className="px-4 py-2 text-slate-500 hover:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest">History</button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* List Section */}
          <div className="xl:col-span-1 space-y-4">
              {applications.map((app) => (
                <button 
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`w-full text-left p-6 rounded-[2rem] border transition-all ${
                    selectedId === app.id ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-600/20' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-mono ${selectedId === app.id ? 'text-indigo-200' : 'text-slate-500'}`}>{app.id}</span>
                        <div className={`w-2 h-2 rounded-full ${app.status === 'verification_failed' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse'}`}></div>
                    </div>
                    <h4 className={`font-bold mb-1 ${selectedId === app.id ? 'text-white' : 'text-slate-200'}`}>{app.name}</h4>
                    <p className={`text-[10px] uppercase font-black tracking-widest ${selectedId === app.id ? 'text-indigo-100' : 'text-slate-500'}`}>{app.product}</p>
                    <div className="mt-4 flex justify-between items-end">
                        <span className={`text-sm font-black ${selectedId === app.id ? 'text-white' : 'text-indigo-400'}`}>{app.amount}</span>
                        {app.score && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${selectedId === app.id ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>{app.score}</span>}
                    </div>
                </button>
              ))}
          </div>

          {/* Verification Pane */}
          <div className="xl:col-span-3">
              {selectedId ? (
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Verification Checklist</h3>
                                <p className="text-slate-500 text-xs font-mono">APP ID: {selectedId} • KYC Level 3 Required</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-all px-4 py-2 rounded-xl bg-indigo-400/5 border border-indigo-400/20">
                            <Eye className="w-4 h-4" /> View Full App
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity & Documents</h4>
                            {[
                              { label: 'Aadhar / PAN Verification', done: true },
                              { label: 'Employment Verification', done: true },
                              { label: 'Salary Slip (3 Months)', done: true },
                              { label: 'Field Investigation Report', done: false },
                            ].map((task, i) => (
                              <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                task.done ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'
                              }`}>
                                <div className="flex items-center gap-3">
                                    {task.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    <span className="text-xs font-bold">{task.label}</span>
                                </div>
                                <button className="p-2 hover:bg-white/5 rounded-lg transition-all"><Download className="w-4 h-4" /></button>
                              </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase className="w-12 h-12" /></div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Employment Context</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] text-slate-600 font-bold uppercase mb-1">Company</div>
                                        <div className="text-sm font-bold text-slate-200">Tech Mahindra Ltd.</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="text-[10px] text-slate-600 font-bold uppercase mb-1">Designation</div>
                                            <div className="text-xs font-bold text-slate-300">Sr. Software Engineer</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-slate-600 font-bold uppercase mb-1">Vintage</div>
                                            <div className="text-xs font-bold text-slate-300">4.2 Years</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                                <p className="text-[10px] text-amber-500/80 leading-relaxed font-bold uppercase">Field agent reports a slight mismatch in current address. Requires voice confirmation.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button className="flex-1 h-14 bg-rose-600/10 border border-rose-500/30 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600/20 transition-all">Flag for Rejection</button>
                        <button className="flex-[2] h-14 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">Submit for Appraisal</button>
                    </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
                    <ClipboardList className="w-12 h-12 text-slate-700 mb-6" />
                    <h3 className="text-xl font-bold text-slate-500">Pick an incoming application</h3>
                    <p className="text-slate-600 max-w-xs text-sm mt-2">Document verification is the first step in the loan journey.</p>
                </div>
              )}
          </div>
      </div>
    </div>
  );
}
