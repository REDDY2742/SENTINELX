import { useState } from 'react';
import { Search, Download, ArrowUpRight, ArrowDownLeft, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

interface UserData {
  balance: string | number;
  transactions?: Array<{id: string, date: string, description: string, merchant: string, amount: number, type: string, category: string, status: string}>;
}

export default function Transactions() {
  const { user } = useOutletContext<{ user: UserData }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const balance = Number(user?.balance || 0);

  const transactions = user?.transactions && user.transactions.length > 0
    ? user.transactions
    : [
        { 
           id: 'TRX-INIT', 
           date: new Date().toISOString().split('T')[0], 
           description: 'Initial Deposit', 
           merchant: 'Sentinel Bank', 
           amount: balance, 
           type: 'credit', 
           category: 'Income', 
           status: 'Completed' 
        }
      ];

  const filteredTransactions = transactions.filter(trx => {
     const matchesSearch = trx.description.toLowerCase().includes(searchTerm.toLowerCase()) || trx.merchant.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesType = filterType === 'all' || trx.type === filterType;
     return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-white mb-1">Transaction History</h1>
            <p className="text-slate-400">View and track your financial activity.</p>
         </div>
         <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700 transition border border-slate-700">
                <Download className="w-4 h-4" /> Export CSV
             </button>
         </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
         {/* Filters */}
         <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 outline-none focus:border-indigo-500 transition"
                />
            </div>
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-700">
               <button 
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filterType === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                  All
               </button>
               <button 
                  onClick={() => setFilterType('credit')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filterType === 'credit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                  Income
               </button>
               <button 
                  onClick={() => setFilterType('debit')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filterType === 'debit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
               >
                  Expenses
               </button>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                     <th className="p-4 font-medium border-b border-slate-800">Transaction</th>
                     <th className="p-4 font-medium border-b border-slate-800">Category</th>
                     <th className="p-4 font-medium border-b border-slate-800">Date</th>
                     <th className="p-4 font-medium border-b border-slate-800">Amount</th>
                     <th className="p-4 font-medium border-b border-slate-800">Status</th>
                     <th className="p-4 font-medium border-b border-slate-800 text-right">Receipt</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                  {filteredTransactions.map((trx) => (
                     <tr key={trx.id} className="hover:bg-slate-800/50 transition group">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${trx.type === 'credit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                 {trx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                              </div>
                              <div>
                                 <div className="font-medium text-white">{trx.description}</div>
                                 <div className="text-xs text-slate-500">{trx.merchant}</div>
                              </div>
                           </div>
                        </td>
                        <td className="p-4 text-slate-400 text-sm">
                           <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">{trx.category}</span>
                        </td>
                        <td className="p-4 text-slate-400 text-sm">{trx.date}</td>
                        <td className={`p-4 font-mono font-medium ${trx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                           {trx.type === 'credit' ? '+' : ''}₹{Math.abs(trx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4">
                           <span className={`text-xs px-2 py-1 rounded-full border ${
                              trx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              trx.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                              'bg-red-500/10 text-red-400 border-red-500/20'
                           }`}>
                              {trx.status}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition">
                              <FileText className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         {/* Pagination */}
         <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
            <div>Showing {filteredTransactions.length} of {transactions.length} transactions</div>
            <div className="flex gap-2">
               <button className="p-2 rounded hover:bg-slate-800 disabled:opacity-50 border border-slate-800" disabled><ChevronLeft className="w-4 h-4" /></button>
               <button className="p-2 rounded hover:bg-slate-800 border border-slate-800"><ChevronRight className="w-4 h-4" /></button>
            </div>
         </div>
      </div>
    </div>
  );
}
