import { useState } from 'react';
import { 
  ArrowLeftRight, IndianRupee, ArrowRight, 
  Loader2, CheckCircle2,
  Printer, Search, Zap
} from 'lucide-react';

export default function FundTransfer() {
  const [sourceAcc, setSourceAcc] = useState('');
  const [destAcc, setDestAcc] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [sourceInfo, setSourceInfo] = useState<any>(null);
  const [destInfo, setDestInfo] = useState<any>(null);

  const mockIdentifyAccounts = async () => {
    setLoading(true);
    setTimeout(() => {
      setSourceInfo({ name: 'Sandeep Reddy', balance: '₹14,52,000.00' });
      setDestInfo({ name: 'Rahul Sharma', branch: 'Mumbai Main' });
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleTransfer = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {step === 1 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/20">
              <ArrowLeftRight className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Internal Fund Transfer</h2>
            <p className="text-slate-500">Intra-bank transfer between customer accounts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto relative z-10">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Source Account</label>
               <input 
                type="text" 
                value={sourceAcc}
                onChange={(e) => setSourceAcc(e.target.value)}
                placeholder="From Account #"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination Account</label>
               <input 
                type="text" 
                value={destAcc}
                onChange={(e) => setDestAcc(e.target.value)}
                placeholder="To Account #"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button 
              onClick={mockIdentifyAccounts}
              disabled={!sourceAcc || !destAcc || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Identify Both Accounts</>}
            </button>
          </div>
        </div>
      )}

      {step === 2 && sourceInfo && destInfo && (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-4">SENDER</span>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500 uppercase font-bold">{sourceInfo.name.charAt(0)}</div>
                        <div>
                            <div className="text-white font-bold">{sourceInfo.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{sourceAcc}</div>
                        </div>
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Balance</span>
                        <span className="text-emerald-400 font-bold tracking-tight">{sourceInfo.balance}</span>
                    </div>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-4">RECIPIENT</span>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-500 uppercase font-bold">{destInfo.name.charAt(0)}</div>
                        <div>
                            <div className="text-white font-bold">{destInfo.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{destAcc}</div>
                        </div>
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Branch</span>
                        <span className="text-slate-300 font-bold tracking-tight text-xs">{destInfo.branch}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><IndianRupee className="w-5 h-5" /></div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Transfer Details</h3>
                            <p className="text-xs text-slate-500">Specify amount and internal notes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Zap className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Instant Settlement</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Transfer Amount</label>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-600 group-focus-within:text-indigo-500 transition-colors">₹</span>
                            <input 
                              type="number" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-slate-950 border border-slate-800 rounded-3xl pl-12 pr-8 py-6 text-3xl font-bold text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex items-end pt-4">
                        <button 
                          onClick={handleTransfer}
                          disabled={!amount || loading}
                          className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Authorize Transfer <ArrowRight className="w-4 h-4" /></>}
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
             <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Transfer Complete</h2>
             <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Amount ₹{amount} has been successfully moved from <b>{sourceAcc}</b> to <b>{destAcc}</b>.</p>
             <div className="flex gap-4 justify-center">
                <button onClick={() => setStep(1)} className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all">New Transfer</button>
                <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-indigo-500/20"><Printer className="w-5 h-5" /> Receipt</button>
             </div>
        </div>
      )}
    </div>
  );
}
