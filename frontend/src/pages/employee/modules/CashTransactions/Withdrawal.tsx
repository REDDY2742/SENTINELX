import { useState } from 'react';
import { 
  CreditCard, User, IndianRupee, ArrowRight, 
  ShieldCheck, AlertCircle, Loader2, CheckCircle2,
  Printer, History, Search
} from 'lucide-react';

export default function CashWithdrawal() {
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Search, 2: Withdraw, 3: Success
  const [accountInfo, setAccountInfo] = useState<any>(null);

  const mockSearchAccount = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAccountInfo({
        name: 'Sandeep Reddy',
        balance: '₹14,52,000.00',
        accountType: 'Savings Gold',
        status: 'Active',
        lastTx: '2 hours ago'
      });
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleWithdraw = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search Account Section */}
      {step === 1 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
            <CreditCard className="w-10 h-10 text-indigo-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Cash Withdrawal</h2>
          <p className="text-slate-500 mb-8">Enter customer account number to initiate withdrawal</p>
          
          <div className="flex gap-4 max-w-md mx-auto relative z-10">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Account Number (e.g. 123456789)"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
              />
            </div>
            <button 
              onClick={mockSearchAccount}
              disabled={!accountNo || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Identify
            </button>
          </div>
          
          <div className="mt-10 grid grid-cols-3 gap-4">
             <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Entry</span>
             </div>
             <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audit Logged</span>
             </div>
             <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">KYC Verified</span>
             </div>
          </div>
        </div>
      )}

      {/* Withdrawal Form Section */}
      {step === 2 && accountInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             {/* Account Summary Card */}
             <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                          <User className="w-6 h-6 text-indigo-500" />
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Verified</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{accountInfo.name}</h3>
                  <p className="text-slate-500 text-xs font-mono mb-6">{accountNo}</p>
                  
                  <div className="space-y-4">
                      <div className="flex justify-between items-end p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Available Balance</span>
                          <span className="text-lg font-bold text-emerald-400 tracking-tight leading-none">{accountInfo.balance}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/50">
                              <span className="block text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Type</span>
                              <span className="text-xs font-bold text-slate-300">Savings Gold</span>
                          </div>
                           <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/50">
                              <span className="block text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Daily Limit</span>
                              <span className="text-xs font-bold text-slate-300">₹5,00,000</span>
                          </div>
                      </div>
                  </div>
                  
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full mt-6 py-3 rounded-xl border border-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-800 hover:text-white transition-all capitalize"
                  >
                    Switch Account
                  </button>
             </div>

             {/* Action Card */}
             <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                        <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Disbursement Details</h3>
                        <p className="text-xs text-slate-500">Specify withdrawal amount and verification</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Withdrawal Amount</label>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-600 group-focus-within:text-indigo-500 transition-colors">₹</span>
                            <input 
                              type="number" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-slate-950 border border-slate-800 rounded-3xl pl-12 pr-8 py-6 text-3xl font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all"
                            />
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-200 mb-1">Security Protocol</p>
                            <p className="text-xs text-amber-500/80 leading-relaxed font-medium">Please ensure the customer provides a valid ID and fingerprint verification before proceeding with large cash disbursements.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="space-y-3">
                           <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">Auth Code</label>
                           <input type="password" placeholder="••••" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-center font-mono focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div className="flex items-end">
                            <button 
                              onClick={handleWithdraw}
                              disabled={!amount || loading}
                              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/10"
                            >
                              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Disburse Cash <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      )}

      {/* Success Section */}
      {step === 3 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-16 text-center animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                 <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                 <CheckCircle2 className="w-12 h-12 text-emerald-500 relative z-10" />
             </div>
             
             <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Withdrawal Successful</h2>
             <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">Transaction ID: <span className="text-slate-300 font-mono underline decoration-indigo-500/50 underline-offset-4">STX-9102-8472</span> has been authorized and cash disbursed.</p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => { setStep(1); setAmount(''); setAccountNo(''); }}
                  className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all active:scale-95 border border-slate-700"
                >
                  New Transaction
                </button>
                <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                  <Printer className="w-5 h-5" /> Print Receipt
                </button>
             </div>
        </div>
      )}
    </div>
  );
}
