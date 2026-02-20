import { useState, useEffect } from 'react';
import { Search, AlertTriangle, Lock, FileText, BadgeCheck, Loader2, User as UserIcon } from 'lucide-react';

export default function BranchCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/branch-management/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.customers) setCustomers(data.customers);
      } catch (err) {
        console.error('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         (customer.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Default risk to 'Low' if not set for now
    const risk = customer.risk || 'Low';
    const matchesFilter = filterRisk === 'All' || risk === filterRisk;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
        <p className="text-lg font-medium animate-pulse">Loading branch customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div>
             <h1 className="text-2xl font-bold text-white tracking-tight">Branch Customers</h1>
             <p className="text-slate-400 text-sm mt-1">Manage {customers.length} active accounts in your branch.</p>
          </div>
          <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="Search name or ID..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-300 outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
                />
          </div>
       </div>

       <div className="flex gap-4 mb-4">
          {['All', 'Low', 'Medium', 'High'].map(risk => (
             <button 
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${filterRisk === risk ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'}`}
             >
                {risk === 'All' ? 'All Risks' : `${risk} Risk`}
             </button>
          ))}
       </div>

       <div className="grid grid-cols-1 gap-6">
          {filteredCustomers.length > 0 ? filteredCustomers.map(customer => {
             const risk = customer.risk || 'Low';
             const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.username || 'Anonymous User';
             
             return (
              <div key={customer.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition group flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                       {fullName.charAt(0)}
                    </div>
                    <div>
                       <h3 className="font-bold text-white text-lg flex items-center gap-2">
                          {fullName}
                          <BadgeCheck className="w-4 h-4 text-emerald-400" />
                       </h3>
                       <div className="flex items-center gap-3 text-sm text-slate-500 font-mono">
                          <span>{customer.username}</span>
                          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                          <span className="capitalize">{customer.accountType || 'Savings'} Account</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-8 text-sm">
                    <div className="text-right">
                       <div className="text-slate-500 mb-1">Total Balance</div>
                       <div className="text-white font-mono font-bold">₹{parseFloat(String(customer.balance || 0)).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-slate-500 mb-1">Risk Profile</div>
                       <span className={`px-2 py-1 rounded text-xs font-bold border ${
                          risk === 'Low' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'
                       }`}>
                          {risk.toUpperCase()}
                       </span>
                    </div>
                    {customer.fraud_alerts > 0 && (
                       <div className="text-right">
                          <div className="text-slate-500 mb-1">Fraud Alerts</div>
                          <div className="text-red-500 font-bold flex items-center justify-end gap-1">
                             <AlertTriangle className="w-4 h-4" /> {customer.fraud_alerts}
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="flex gap-2">
                    <button className="p-2 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 rounded-lg transition" title="View Details">
                       <FileText className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition" title="Freeze Account">
                       <Lock className="w-5 h-5" />
                    </button>
                 </div>
              </div>
             );
          }) : (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <UserIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Customers Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">There are no customers registered in this branch matching your criteria.</p>
            </div>
          )}
       </div>
    </div>
  );
}
