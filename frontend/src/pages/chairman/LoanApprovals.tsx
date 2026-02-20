import { useState, useEffect } from 'react';
import { Filter, CheckCircle, XCircle, FileText, Briefcase, User, Calendar, DollarSign, Clock, Loader2 } from 'lucide-react';

export default function LoanApprovals() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://13.201.79.48:8000/api/v1/auth/admin/loans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setLoans(data.loans || []);
      } catch (err) {
        console.error('Failed to fetch loans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  if (loading) {
    return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div>
             <h1 className="text-2xl font-light text-white tracking-wide">Loan Applications</h1>
             <p className="text-slate-400 text-sm mt-1">Review and approve pending loan requests.</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2 text-slate-400">
                <Filter className="w-4 h-4" /> Filter
             </div>
             <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20">
                Generate Reports
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-4">
             {loans.length > 0 ? loans.map((loan) => (
                <div 
                   key={loan.id}
                   onClick={() => setSelectedLoan(loan)}
                   className={`bg-slate-900 border ${selectedLoan?.id === loan.id ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-800 hover:border-slate-600'} rounded-xl p-6 cursor-pointer transition group relative overflow-hidden`}
                >
                   <div className="absolute top-0 right-0 w-24 h-24 bg-slate-800/50 rounded-bl-full -mr-8 -mt-8 transition group-hover:bg-indigo-500/10" />
                   
                   <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-300">
                            {loan.applicant ? loan.applicant.charAt(0) : 'L'}
                         </div>
                         <div>
                            <h3 className="font-bold text-white text-lg">{loan.applicant}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                               <span>{loan.id}</span>
                               <span className="w-1 h-1 bg-slate-600 rounded-full" />
                               <span>{loan.type}</span>
                            </div>
                         </div>
                      </div>
                      <LoanStatus status={loan.status} />
                   </div>

                   <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 mt-2">
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Amount</p>
                          <p className="text-white font-mono font-medium">₹{Number(loan.amount).toLocaleString('en-IN')}</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Credit Score</p>
                          <p className={`font-mono font-bold ${
                             loan.creditScore >= 750 ? 'text-emerald-400' : 
                             loan.creditScore >= 650 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{loan.creditScore}</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Risk Level</p>
                          <span className={`text-xs px-2 py-0.5 rounded border ${
                             loan.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                             loan.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                             'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                             {loan.risk}
                          </span>
                       </div>
                   </div>
                </div>
             )) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
                   <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-10" />
                   <p className="text-lg">No pending loan applications found.</p>
                </div>
             )}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
             {selectedLoan ? (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24 shadow-2xl">
                   <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      Application Details
                   </h2>
                   
                   <div className="space-y-6">
                      <DetailRow label="Applicant Name" value={selectedLoan.applicant} icon={<User className="w-4 h-4" />} />
                      <DetailRow label="Annual Income" value={`₹${Number(selectedLoan.income || 0).toLocaleString('en-IN')}`} icon={<DollarSign className="w-4 h-4" />} />
                      <DetailRow label="Requested Amount" value={`₹${Number(selectedLoan.amount || 0).toLocaleString('en-IN')}`} icon={<DollarSign className="w-4 h-4" />} />
                      <DetailRow label="Tenure" value={`${selectedLoan.tenure || 12} Months`} icon={<Calendar className="w-4 h-4" />} />
                      <DetailRow label="Submission Date" value={selectedLoan.date || 'Today'} icon={<Clock className="w-4 h-4" />} />
                      
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Risk Analysis</h4>
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                               <span className="text-slate-400">Debt-to-Income Ratio</span>
                               <span className="text-emerald-400 font-mono">24%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                               <span className="text-slate-400">Probability of Default</span>
                               <span className="text-emerald-400 font-mono">1.2%</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-slate-800">
                         <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="w-4 h-4" /> Approve
                         </button>
                         <button className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-red-500/20">
                            <XCircle className="w-4 h-4" /> Reject
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

function LoanStatus({ status }: { status: string }) {
   const colors = {
      'Approved': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      'Rejected': 'text-red-400 bg-red-500/10 border-red-500/20',
      'Pending Review': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      'Under Analysis': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
   };
   
   return (
      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colors[status as keyof typeof colors] || colors['Pending Review']}`}>
         {status}
      </span>
   )
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
