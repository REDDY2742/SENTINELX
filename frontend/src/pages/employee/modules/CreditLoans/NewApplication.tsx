import { useState } from 'react';
import { 
  FileText, User, IndianRupee, ShieldCheck, 
  ArrowRight, CheckCircle2, Loader2,
  Calculator
} from 'lucide-react';

export default function NewLoanApplication() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    loanType: 'personal',
    amount: '',
    tenure: '24',
    interestRate: '12.5',
    purpose: ''
  });

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
             <div key={s} className="flex flex-col items-center relative z-10 transition-all">
                <div className={`w-12 h-12 rounded-2xl font-black flex items-center justify-center border-2 transition-all ${
                    step >= s ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20 scale-110' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                    {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-3 ${step >= s ? 'text-indigo-400' : 'text-slate-600'}`}>
                    {s === 1 ? 'Customer' : s === 2 ? 'Loan Details' : 'Review'}
                </span>
             </div>
          ))}
          <div className="absolute top-6 left-20 right-20 h-0.5 bg-slate-900 -z-0">
             <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${(step-1)*50}%` }}></div>
          </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-1000" style={{ transform: `translateX(${(step-1)*20}px)` }}></div>
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"><User className="w-6 h-6" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Debtor Identification</h3>
                        <p className="text-slate-500 text-sm">Target account for loan disbursement</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Number</label>
                       <input type="text" placeholder="e.g. 1029482012" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 focus:outline-none transition-all font-mono" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">PAN Card Number</label>
                       <input type="text" placeholder="ABCDE1234F" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 focus:outline-none transition-all font-mono uppercase" />
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-indigo-500 shrink-0" />
                    <p className="text-xs text-indigo-400 leading-relaxed font-medium">Auto-fetching customer CIBIL score and financial history upon identification.</p>
                </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"><IndianRupee className="w-6 h-6" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Terms & Tenure</h3>
                        <p className="text-slate-500 text-sm">Principal amount and repayment schedule</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Loan Product</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Personal', 'Gold', 'Vehicle', 'Business'].map(t => (
                                    <button 
                                      key={t}
                                      onClick={() => setFormData({...formData, loanType: t.toLowerCase()})}
                                      className={`p-4 rounded-2xl border text-xs font-bold transition-all ${
                                        formData.loanType === t.toLowerCase() ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                      }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Requested Amount</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-600">₹</span>
                                <input type="number" placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-indigo-500 focus:outline-none transition-all font-black text-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                         <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Calculator className="w-3 h-3" /> Quick Est. EMI</h4>
                            <div className="text-4xl font-black text-white tracking-tighter">₹4,250<span className="text-xs text-slate-500 font-medium ml-2">/ month</span></div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">At 12.5% Rate • 24 Months</p>
                         </div>
                    </div>
                </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="flex flex-col items-center text-center space-y-4 py-6">
                     <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                        <FileText className="w-10 h-10 text-emerald-500" />
                     </div>
                     <h3 className="text-3xl font-black text-white tracking-tight">Review Submission</h3>
                     <p className="text-slate-500 max-w-sm">Please verify all loan parameters before sending for manager approval.</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Processing Fee</span>
                        <span className="text-xs font-bold text-white">₹2,500</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Disbursement Time</span>
                        <span className="text-xs font-bold text-white">24-48 Hours</span>
                    </div>
                 </div>
            </div>
          )}

          <div className="mt-12 flex gap-4">
             {step > 1 && (
               <button 
                 onClick={() => setStep(step - 1)}
                 className="flex-1 h-16 rounded-[2rem] bg-slate-950 border border-slate-800 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all"
               >
                 Go Back
               </button>
             )}
             <button 
               onClick={handleNext}
               disabled={loading}
               className="flex-[2] h-16 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : step === 3 ? 'Submit for Approval' : <>Continue Session <ArrowRight className="w-5 h-5" /></>}
             </button>
          </div>
      </div>
    </div>
  );
}
