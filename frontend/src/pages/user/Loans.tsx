import { DollarSign, Home, MoreHorizontal } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

interface UserData {
  creditScore?: number;
  totalOutstanding?: number;
  nextEmi?: number;
  nextEmiDate?: string;
  activeLoans?: Array<{
    id: string,
    type: string,
    amount: number,
    paid: number,
    interest: number,
    status: string,
    nextEmi: string
  }>;
  pendingApplications?: Array<{
    id: string,
    type: string,
    amount: number,
    status: string,
    timestamp: string,
    details?: string
  }>;
}

export default function UserLoans() {
  const navigate = useNavigate();
  const { user } = useOutletContext<{ user: UserData }>();
  const loans = user?.activeLoans || [];
  const pendingApps = user?.pendingApplications || [];

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Loans</h1>
            <p className="text-slate-400">Manage your active loans and repayments.</p>
         </div>
         <button 
           onClick={() => navigate('/user/loans/apply')}
           className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 flex items-center gap-2"
         >
            <DollarSign className="w-5 h-5" />
            Apply New Loan
         </button>
      </div>

      {/* Loan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Total Outstanding</h3>
            <p className="text-3xl font-bold text-white font-mono">
               ₹{(user?.totalOutstanding || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
         </div>
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Next EMI Due</h3>
            <p className="text-3xl font-bold text-emerald-400 font-mono">
               ₹{(user?.nextEmi || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            {user?.nextEmiDate && (
               <p className="text-xs text-slate-500 mt-1">Due on {user.nextEmiDate}</p>
            )}
         </div>
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Credit Score</h3>
            <div className="flex items-center gap-3">
               <div className={`w-12 h-12 rounded-full border-4 ${Number(user?.creditScore || 0) > 700 ? 'border-emerald-500 text-emerald-500' : 'border-amber-500 text-amber-500'} flex items-center justify-center font-bold`}>
                  {user?.creditScore || 750}
               </div>
               <span className={`text-sm font-medium ${Number(user?.creditScore || 0) > 700 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {Number(user?.creditScore || 0) > 700 ? 'Excellent' : 'Good'}
               </span>
            </div>
         </div>
      </div>

      {/* Pending Applications List */}
      {pendingApps.length > 0 && (
         <div className="space-y-4">
            <div className="flex items-center gap-2">
               <h2 className="text-xl font-bold text-white">Pending Applications</h2>
               <span className="bg-indigo-600/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Reviewing</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {pendingApps.map((app) => (
                  <div key={app.id} className="bg-slate-900 border border-slate-800/50 rounded-2xl p-5 hover:border-indigo-500/30 transition group relative overflow-hidden">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                              <DollarSign className="w-5 h-5 text-indigo-400" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">{app.type}</h4>
                              <p className="text-[10px] text-slate-500 font-mono">{app.id}</p>
                           </div>
                        </div>
                        <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full capitalize">
                           {app.status}
                        </span>
                     </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Applied Amount</p>
                           <p className="text-xl font-bold text-white font-mono">₹{app.amount.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                           <div className="text-right">
                              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Applied On</p>
                              <p className="text-xs text-slate-400">{new Date(app.timestamp).toLocaleDateString()}</p>
                           </div>
                           {app.status === 'pending' && (
                             <button 
                               onClick={() => navigate('/user/loans/apply', { state: { editMode: true, application: app } })}
                               className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-all active:scale-95"
                             >
                               Edit Application
                             </button>
                           )}
                        </div>
                      </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Active Loans List */}
      <div className="space-y-4">
         <h2 className="text-xl font-bold text-white">Active Loans</h2>
         {loans.length > 0 ? loans.map((loan) => (
            <div key={loan.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition group relative overflow-hidden">
               {/* ... (Loan card content same as before) ... */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition"></div>
               
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                        {loan.type === 'Home Loan' ? <Home className="w-6 h-6 text-indigo-400" /> : <DollarSign className="w-6 h-6 text-emerald-400" />}
                     </div>
                     <div>
                        <h3 className="font-bold text-lg text-white">{loan.type}</h3>
                        <p className="text-sm text-slate-500 font-mono">{loan.id}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                     <div>
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Principal</p>
                        <p className="font-mono text-white font-medium">₹{loan.amount.toLocaleString('en-IN')}</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Interest Rate</p>
                        <p className="font-mono text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded w-fit">{loan.interest}%</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Outstanding</p>
                        <p className="font-mono text-white font-medium">₹{(loan.amount - loan.paid).toLocaleString('en-IN')}</p>
                     </div>
                     <div>
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status</p>
                        <span className={`text-xs px-2 py-1 rounded-full border ${loan.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                           {loan.status}
                        </span>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition border border-transparent hover:border-slate-700">
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
                  </div>
               </div>

               {/* Progress Bar */}
               <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                     <span>Paid: ₹{loan.paid.toLocaleString('en-IN')}</span>
                     <span>Total: ₹{loan.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${(loan.paid / loan.amount) * 100}%` }}
                     ></div>
                  </div>
               </div>
            </div>
         )) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-slate-500" />
               </div>
               <h3 className="text-lg font-bold text-white mb-2">No active loans</h3>
               <p className="text-slate-400 max-w-xs mx-auto mb-6">You don't have any active loans at the moment. Apply for a new loan to get started.</p>
               <button 
                onClick={() => navigate('/user/loans/apply')}
                className="text-indigo-400 font-bold hover:text-indigo-300 transition"
               >
                + Apply Now
               </button>
            </div>
         )}
      </div>
    </div>
  );
}
