import { useState } from 'react';
import { 
  Banknote, User, IndianRupee, ArrowRight, 
  ShieldCheck, Loader2, CheckCircle2,
  Printer, History, Search
} from 'lucide-react';

export default function CashDeposit() {
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [accountInfo, setAccountInfo] = useState<any>(null);

  const mockSearchAccount = async () => {
    setLoading(true);
    setTimeout(() => {
      setAccountInfo({
        name: 'Suhasini Reddy',
        balance: '₹5,20,450.00',
        accountType: 'Savings Standard',
        status: 'Active'
      });
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleDeposit = async () => {
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <Banknote className="w-10 h-10 text-emerald-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Cash Deposit</h2>
          <p className="text-slate-500 mb-8">Identify the recipient account to proceed with deposit</p>
          
          <div className="flex gap-4 max-w-md mx-auto relative z-10">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Beneficiary Account Number"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono"
              />
            </div>
            <button 
              onClick={mockSearchAccount}
              disabled={!accountNo || loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Find
            </button>
          </div>
          
          <div className="mt-10 flex justify-center gap-8">
             <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Anti-Fraud Checked</span>
             </div>
             <div className="flex items-center gap-2 text-slate-500">
                <History className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Real-time GL Update</span>
             </div>
          </div>
        </div>
      )}

      {step === 2 && accountInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <User className="w-6 h-6 text-emerald-500" />
                      </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{accountInfo.name}</h3>
                  <p className="text-slate-500 text-xs font-mono mb-6">{accountNo}</p>
                  
                  <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                          <span className="block text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 text-right">Account Balance</span>
                          <span className="text-lg font-bold text-white tracking-tight leading-none block text-right">{accountInfo.balance}</span>
                      </div>
                  </div>
                  
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full mt-6 py-3 rounded-xl border border-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-800 hover:text-white transition-all capitalize"
                  >
                    Change Recipient
                  </button>
             </div>

             <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Deposit Capture</h3>
                        <p className="text-xs text-slate-500">Record cash denominations and total amount</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Total Cash Amount</label>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-600 group-focus-within:text-emerald-500 transition-colors">₹</span>
                            <input 
                              type="number" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-slate-950 border border-slate-800 rounded-3xl pl-12 pr-8 py-6 text-3xl font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                             <span className="block text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Depositor Name</span>
                             <input type="text" placeholder="Self / Others" className="w-full bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 placeholder:text-slate-700" />
                         </div>
                         <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                             <span className="block text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Source of Funds</span>
                             <input type="text" placeholder="Business, Salary, etc." className="w-full bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 placeholder:text-slate-700" />
                         </div>
                    </div>

                    <div className="flex items-end pt-4">
                        <button 
                          onClick={handleDeposit}
                          disabled={!amount || loading}
                          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-600/10"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Deposit <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </div>
                </div>
             </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-16 text-center animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                 <CheckCircle2 className="w-12 h-12 text-emerald-500 relative z-10" />
             </div>
             
             <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Deposit Processed</h2>
             <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Beneficiary <b>{accountInfo.name}</b> has been credited with ₹{amount}.</p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => { setStep(1); setAmount(''); setAccountNo(''); }}
                  className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95"
                >
                  New Deposit
                </button>
                <button className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95">
                  <Printer className="w-5 h-5" /> Print Receipt
                </button>
             </div>
        </div>
      )}
    </div>
  );
}
