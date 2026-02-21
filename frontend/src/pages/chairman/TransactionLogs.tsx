import { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, FileText, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function TransactionLogs() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/admin/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) {
    return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
    );
  }

  const filtered = transactions.filter(trx => 
    trx.user?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trx.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-light text-white tracking-wide">Global Transactions</h1>
             <p className="text-slate-400 text-sm mt-1">Real-time monitoring of all network activity.</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 border border-slate-700">
                <Filter className="w-4 h-4" /> Filter
             </button>
             <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                <Download className="w-4 h-4" /> Export CSV
             </button>
          </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="Search by User, Merchant, or ID..." 
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
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">User</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Merchant/Source</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Details</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                   {filtered.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-800/30 transition group">
                         <td className="p-4 font-mono text-xs text-slate-500">{trx.id}</td>
                         <td className="p-4 font-medium text-white">{trx.user}</td>
                         <td className="p-4">
                            <span className={`inline-flex items-center gap-1 font-medium ${trx.type === 'Credit' ? 'text-emerald-400' : 'text-slate-300'}`}>
                               {trx.type === 'Credit' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                               {trx.type}
                            </span>
                         </td>
                         <td className="p-4 text-slate-400">{trx.merchant}</td>
                         <td className={`p-4 font-mono font-bold ${trx.type === 'Credit' ? 'text-emerald-400' : 'text-white'}`}>
                            ₹{Number(trx.amount).toLocaleString('en-IN')}
                         </td>
                         <td className="p-4 text-slate-500 text-xs font-mono">{trx.date}</td>
                         <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${
                               trx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                               trx.status === 'Flagged' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 
                               'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                               {trx.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : 
                                trx.status === 'Flagged' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
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
       </div>
    </div>
  );
}
