import { useState } from 'react';
import { 
  Lock, CheckCircle2, AlertCircle, Loader2, IndianRupee, 
  ShieldCheck, ClipboardCheck, ArrowRight, Printer,
  LogOut
} from 'lucide-react';

export default function DayEndClosing() {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Physical Cash Reconciled', done: true },
    { id: 2, label: 'Cheque Clearing Logs Verified', done: true },
    { id: 3, label: 'Pending Transactions Resolved', done: true },
    { id: 4, label: 'Vault Entry Log Signed', done: false },
    { id: 5, label: 'Manager Counter-Sign Obtained', done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleFinalClose = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setComplete(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {!complete ? (
        <>
            <div className="flex flex-col items-center text-center space-y-4 mb-10">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/20">
                    <Lock className="w-10 h-10 text-indigo-500" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">End of Day Closing</h2>
                <p className="text-slate-500 max-w-md">The system will finalize all transaction records and lock the general ledger for February 14, 2026.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-indigo-500" /> Closing Checklist
                    </h3>
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <button 
                              key={task.id}
                              onClick={() => toggleTask(task.id)}
                              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                task.done ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'
                              }`}
                            >
                                <span className="text-sm font-bold">{task.label}</span>
                                {task.done ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-800" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-indigo-500" /> Summary Totals
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Inflow</span>
                                <span className="text-emerald-400 font-black tracking-tight">₹15,42,900.00</span>
                            </div>
                            <div className="flex justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Outflow</span>
                                <span className="text-rose-400 font-black tracking-tight">₹8,92,340.00</span>
                            </div>
                            <div className="flex justify-between p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/30">
                                <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Net Change</span>
                                <span className="text-indigo-200 font-black tracking-tight">+ ₹6,50,560.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-500/80 leading-relaxed font-medium capitalize">Closing is irreversible. ensure all physical cash matches the digital ledger before finalizing.</p>
                    </div>

                    <button 
                      onClick={handleFinalClose}
                      disabled={tasks.some(t => !t.done) || loading}
                      className="w-full h-16 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-rose-600/20 active:scale-95 transition-all"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Finalize & Shutdown <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </div>
            </div>
        </>
      ) : (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-16 text-center animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                 <ShieldCheck className="w-12 h-12 text-emerald-500 z-10" />
             </div>
             <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Ledger Closed</h2>
             <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">February 14, 2026 is now locked. No further transactions can be processed from this station.</p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"><Printer className="w-5 h-5 inline mr-2" /> Daily Report</button>
                <button onClick={() => window.location.href='/login'} className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-rose-600/20"><LogOut className="w-5 h-5" /> Logout Session</button>
             </div>
        </div>
      )}
    </div>
  );
}
