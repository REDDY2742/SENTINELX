import { useState } from 'react';
import { 
  Receipt, Search, Loader2, CheckCircle2, 
  Printer, ScrollText, AlertCircle, Calendar, ShieldCheck,
  ArrowRight, IndianRupee
} from 'lucide-react';

export default function ChequeProcessing() {
  const [chequeNo, setChequeNo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [chequeData, setChequeData] = useState<any>(null);

  const mockScanCheque = async () => {
    setLoading(true);
    setTimeout(() => {
      setChequeData({
        issuer: 'Vikas Khanna',
        bank: 'HDFC Bank',
        accountNo: '•••• 8821',
        type: 'Bearer Cheque',
        date: '14-02-2026'
      });
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleProcess = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {step === 1 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <ScrollText className="w-10 h-10 text-amber-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Cheque Clearing</h2>
          <p className="text-slate-500 mb-8">Scan or enter cheque details for clearing and processing</p>
          
          <div className="flex gap-4 max-w-md mx-auto relative z-10">
            <input 
              type="text" 
              value={chequeNo}
              onChange={(e) => setChequeNo(e.target.value)}
              placeholder="Enter 6-digit Cheque No."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all font-mono tracking-[0.2em]"
            />
            <button 
              onClick={mockScanCheque}
              disabled={!chequeNo || loading}
              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-8 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Scan</>}
            </button>
          </div>
          
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-lg mx-auto">
             <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">CTS-2010 Compliant Verify</span>
             </div>
             <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Post-Dated Check Filter</span>
             </div>
          </div>
        </div>
      )}

      {step === 2 && chequeData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                          <Receipt className="w-7 h-7 text-amber-500" />
                      </div>
                      <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">Scanned</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{chequeData.issuer}</h3>
                  <p className="text-slate-500 text-sm mb-6">{chequeData.bank}</p>
                  
                  <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex justify-between">
                          <span className="text-xs text-slate-500">Account</span>
                          <span className="text-xs font-mono text-slate-300">{chequeData.accountNo}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex justify-between">
                          <span className="text-xs text-slate-500">Date</span>
                          <span className="text-xs font-mono text-slate-300">{chequeData.date}</span>
                      </div>
                  </div>
                  
                  <button onClick={() => setStep(1)} className="w-full mt-8 py-3 rounded-xl border border-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-800 hover:text-white transition-all">Re-scan Cheque</button>
             </div>

             <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Clearing Details</h3>
                        <p className="text-xs text-slate-500">Record clearing amount and deposit account</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Cheque Amount</label>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-600 group-focus-within:text-amber-500 transition-colors">₹</span>
                            <input 
                              type="number" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-slate-950 border border-slate-800 rounded-3xl pl-12 pr-8 py-6 text-3xl font-bold text-white focus:outline-none focus:border-amber-500 focus:ring-8 focus:ring-amber-500/5 transition-all"
                            />
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-200 mb-1">CTS Verification</p>
                            <p className="text-xs text-amber-500/80 leading-relaxed font-medium">Verify signature match and MICR code integrity before clearing. High-value cheques require manager approval.</p>
                        </div>
                    </div>

                    <div className="flex items-end pt-4">
                        <button 
                          onClick={handleProcess}
                          disabled={!amount || loading}
                          className="w-full h-16 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-amber-600/20"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initiate Clearing <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </div>
                </div>
             </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-16 text-center animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                 <CheckCircle2 className="w-12 h-12 text-emerald-500" />
             </div>
             <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Clearing Initiated</h2>
             <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Cheque No. <b>{chequeNo}</b> for ₹{amount} has been added to the clearing queue.</p>
             <div className="flex gap-4 justify-center">
                <button onClick={() => { setStep(1); setAmount(''); setChequeNo(''); }} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all">Process Another</button>
                <button className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold flex items-center gap-3"><Printer className="w-5 h-5" /> Advice Slip</button>
             </div>
        </div>
      )}
    </div>
  );
}
