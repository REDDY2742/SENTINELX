import { useState } from 'react';
import { 
  UserCheck, Search, Loader2, 
  FileText, AlertCircle, ArrowRight, Fingerprint
} from 'lucide-react';

export default function KYCUpdate() {
  const [accountNo, setAccountNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [customerData, setCustomerData] = useState<any>(null);

  const mockSearchCustomer = async () => {
    setLoading(true);
    setTimeout(() => {
      setCustomerData({
        name: 'Rahul Sharma',
        dob: '12-05-1990',
        kycStatus: 'Expired',
        lastUpdated: 'Feb 2022',
        address: 'Flat 402, Blue Heights, Mumbai'
      });
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {step === 1 && (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
            <UserCheck className="w-10 h-10 text-indigo-500" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 leading-tight">Digital KYC Desk</h2>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto">Update customer identity records and verify documents in real-time</p>
          
          <div className="flex gap-4 max-w-md mx-auto">
            <input 
              type="text" 
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              placeholder="Cust Account ID"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-indigo-500 transition-all font-mono"
            />
            <button 
              onClick={mockSearchCustomer}
              disabled={!accountNo || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-8 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-4" /> Fetch</>}
            </button>
          </div>
        </div>
      )}

      {step === 2 && customerData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500 mb-6 uppercase font-bold text-xl">
                        {customerData.name.charAt(0)}{customerData.name.split(' ')[1]?.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{customerData.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mb-6">{accountNo}</p>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-800/50">
                        <div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Status</span>
                            <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded inline-block">{customerData.kycStatus}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">Last Update</span>
                            <span className="text-xs font-bold text-slate-300">{customerData.lastUpdated}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-500/80 leading-relaxed font-bold uppercase">Account is currently restricted for outgoing transfers due to expired KYC.</p>
                </div>
            </div>

            <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-500" /> Delta Modifications
                </h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 group focus-within:border-indigo-500 transition-all">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Primary Phone</span>
                            <input type="text" defaultValue="+91 98XXX XXX90" className="w-full bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0" />
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 group focus-within:border-indigo-500 transition-all">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Residential Address</span>
                            <input type="text" defaultValue={customerData.address} className="w-full bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0" />
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Biometric Validation</h4>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-indigo-500/5 rounded-2xl flex items-center justify-center border border-indigo-500/20 group cursor-pointer hover:bg-indigo-500/10 transition-all">
                                <Fingerprint className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">Place customer's left thumb on the scanner for real-time Aadhaar Bio-Auth verification.</p>
                                <div className="mt-4 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[65%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                        Commit KYC Updates <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
