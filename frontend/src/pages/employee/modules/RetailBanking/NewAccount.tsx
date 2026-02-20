import { useState } from 'react';
import { 
  UserPlus, ShieldCheck, 
  CheckCircle2, Loader2, ArrowRight,
  FileText, Heart
} from 'lucide-react';

export default function NewAccountOpening() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(step + 1);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Stepper */}
      <div className="flex items-center justify-between px-10 relative mb-12">
          {[1, 2, 3].map((s) => (
             <div key={s} className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-2xl font-black flex items-center justify-center border-2 transition-all ${
                    step >= s ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-600/20 scale-110' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                    {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-3 ${step >= s ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {s === 1 ? 'Personal' : s === 2 ? 'Documents' : 'Review'}
                </span>
             </div>
          ))}
          <div className="absolute top-6 left-20 right-20 h-0.5 bg-slate-900 -z-0">
             <div className="h-full bg-emerald-600 transition-all duration-700" style={{ width: `${(step-1)*50}%` }}></div>
          </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><UserPlus className="w-6 h-6" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Personal Information</h3>
                        <p className="text-slate-500 text-sm">Primary details for the new account holder</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                       <input type="text" placeholder="As per Aadhaar" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                       <input type="text" placeholder="+91 00000 00000" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 transition-all font-mono" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                       <input type="email" placeholder="customer@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Type</label>
                       <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 transition-all appearance-none cursor-pointer">
                          <option>Savings Gold</option>
                          <option>Savings Standard</option>
                          <option>Current Prime</option>
                          <option>Salary Account</option>
                       </select>
                    </div>
                </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"><FileText className="w-6 h-6" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Identity Verification</h3>
                        <p className="text-slate-500 text-sm">Upload and verify KYC documentation</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Aadhaar Card', 'PAN Card', 'Address Proof', 'Signature Scan'].map((doc) => (
                      <div key={doc} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                          <span className="text-xs font-bold text-slate-400">{doc}</span>
                          <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-600/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">Upload</button>
                      </div>
                    ))}
                </div>

                <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                    <p className="text-[10px] text-emerald-500/80 leading-relaxed font-bold uppercase">Biometric verification will be triggered on the external pad upon completion of this step.</p>
                </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="flex flex-col items-center text-center space-y-4 py-6">
                     <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                        <Heart className="w-10 h-10 text-emerald-500" />
                     </div>
                     <h3 className="text-3xl font-black text-white tracking-tight">Confirm Enrollment</h3>
                     <p className="text-slate-500 max-w-sm">New account will be provisioned instantly upon manager counter-sign.</p>
                 </div>

                 <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 divide-y divide-slate-800/50">
                    <div className="py-4 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Initial Deposit</span>
                        <span className="text-sm font-black text-white">₹10,000.00</span>
                    </div>
                    <div className="py-4 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Debit Card Type</span>
                        <span className="text-sm font-black text-white">Platinum Visa</span>
                    </div>
                    <div className="py-4 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Welcome Kit</span>
                        <span className="text-sm font-black text-white">Physical (Branch Pick)</span>
                    </div>
                 </div>
            </div>
          )}

          <div className="mt-12 flex gap-4">
             {step > 1 && (
               <button onClick={() => setStep(step - 1)} className="flex-1 h-16 rounded-[2rem] bg-slate-950 border border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Previous</button>
             )}
             <button 
               onClick={handleNext} 
               disabled={loading}
               className="flex-[2] h-16 rounded-[2rem] bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : step === 3 ? 'Finalize Enrollment' : <>Continue Process <ArrowRight className="w-5 h-5" /></>}
             </button>
          </div>
      </div>
    </div>
  );
}
