import { useState } from 'react';
import { Search, Filter, Download, FileText } from 'lucide-react';

const mockTransactions = [
  { id: 'TRX-9871', date: '2026-10-24 10:45:00', type: 'Debit', amount: 15.99, user: 'Emily Clark', merchant: 'Netflix', status: 'Completed', method: 'Card' },
  { id: 'TRX-9872', date: '2026-10-24 09:30:15', type: 'Credit', amount: 4500.00, user: 'David Miller', merchant: 'Salary Deposit', status: 'Completed', method: 'NEFT' },
  { id: 'TRX-9873', date: '2026-10-24 08:15:33', type: 'Debit', amount: 12500.00, user: 'Sophia Wilson', merchant: 'Jewelry Store', status: 'Flagged', method: 'UPI' },
];

export default function BranchTransactions() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight">Branch Transactions</h1>
             <p className="text-slate-400 text-sm mt-1">Real-time activity for your branch.</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium transition border border-slate-700">
                <Filter className="w-4 h-4" /> Filter
             </button>
             <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20">
                <Download className="w-4 h-4" /> Export
             </button>
          </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="Search..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-300 outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
                />
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-950/80 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                      <th className="p-4">ID</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Details</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                   {mockTransactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-800/30 transition group">
                         <td className="p-4 font-mono text-xs text-slate-500">{trx.id}</td>
                         <td className="p-4 text-white font-medium">{trx.user}</td>
                         <td className="p-4 text-slate-400 font-mono text-xs">{trx.type}</td>
                         <td className={`p-4 font-mono font-bold ${trx.type === 'Credit' ? 'text-emerald-400' : 'text-slate-300'}`}>${trx.amount}</td>
                         <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${
                                trx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                trx.status === 'Flagged' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                                {trx.status}
                            </span>
                         </td>
                         <td className="p-4 text-right">
                            <button className="p-2 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition" title="View Details">
                               <FileText className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
