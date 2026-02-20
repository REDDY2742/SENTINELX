import { useState } from 'react';
import { Filter, CheckCircle, XCircle, FileText, Briefcase, User, Calendar, DollarSign, ShieldCheck } from 'lucide-react';

const mockLoans = [
  { id: 'LN-2024-001', applicant: 'Emily Clark', amount: 12000, type: 'Personal', score: 750, status: 'Awaiting Manager', risk: 'Low', income: 65000 },
  { id: 'LN-2024-002', applicant: 'David Miller', amount: 45000, type: 'Auto Loan', score: 680, status: 'Under Review', risk: 'Medium', income: 52000 },
];

export default function BranchLoanApprovals() {
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight">Branch Loan Approvals</h1>
             <p className="text-slate-400 text-sm mt-1">Review loan applications from your branch customers.</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2 text-slate-400">
                <Filter className="w-4 h-4" /> Queue
             </div>
             <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20">
                Daily Report
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-4">
             {mockLoans.map((loan) => (
                <div 
                   key={loan.id}
                   onClick={() => setSelectedLoan(loan)}
                   className={`bg-slate-900 border ${selectedLoan?.id === loan.id ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-800 hover:border-slate-600'} rounded-xl p-6 cursor-pointer transition group relative overflow-hidden`}
                >
                   <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-indigo-400">
                            {loan.applicant.charAt(0)}
                         </div>
                         <div>
                            <h3 className="font-bold text-white text-lg">{loan.applicant}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                               <span>{loan.id}</span>
                               <span className="w-1 h-1 bg-slate-600 rounded-full" />
                               <span>{loan.type}</span>
                            </div>
                         </div>
                         {loan.risk === 'Low' && (
                            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                               <ShieldCheck className="w-3 h-3" /> Safe
                            </div>
                         )}
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                         {loan.status}
                      </span>
                   </div>

                   <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 mt-2">
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Amount</p>
                          <p className="text-white font-mono font-medium">${loan.amount.toLocaleString()}</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">CIBIL Score</p>
                          <p className={`font-mono font-bold ${
                             loan.score >= 750 ? 'text-emerald-400' : 
                             loan.score >= 650 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{loan.score}</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Pre-Approved Limit</p>
                          <span className="text-slate-300 font-mono font-medium">$50,000</span>
                       </div>
                   </div>
                </div>
             ))}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
             {selectedLoan ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24 shadow-2xl animate-in slide-in-from-right-4 duration-300">
                   <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      Application Details
                   </h2>
                   
                   <div className="space-y-6">
                      <DetailRow label="Applicant Name" value={selectedLoan.applicant} icon={<User className="w-4 h-4" />} />
                      <DetailRow label="Annual Income" value={`$${selectedLoan.income.toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} />
                      <DetailRow label="Requested Amount" value={`$${selectedLoan.amount.toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} />
                      <DetailRow label="Tenure" value="48 Months" icon={<Calendar className="w-4 h-4" />} />
                      
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Branch Verification</h4>
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                               <span className="text-slate-400">KYC Status</span>
                               <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
                            </div>
                            <div className="flex justify-between text-sm">
                               <span className="text-slate-400">Income Proof</span>
                               <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
                            </div>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 space-y-3">
                         <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="w-4 h-4" /> Approve Loan
                         </button>
                         <button className="w-full bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition border border-slate-700 hover:border-red-500/30">
                            <XCircle className="w-4 h-4" /> Reject / Hold
                         </button>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
                   <Briefcase className="w-16 h-16 mb-4 opacity-20" />
                   <p>Select an application to view details.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
   return (
      <div className="flex justify-between items-center group">
         <div className="flex items-center gap-3 text-slate-400 group-hover:text-indigo-400 transition">
            {icon}
            <span className="text-sm font-medium">{label}</span>
         </div>
         <span className="text-white font-mono font-medium">{value}</span>
      </div>
   )
}
