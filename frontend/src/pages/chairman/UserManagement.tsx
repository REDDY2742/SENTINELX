import { useState, useEffect } from 'react';
import { Search, UserCheck, AlertTriangle, MoreHorizontal, Unlock, Lock, Download, Loader2 } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://13.201.79.48:8000/api/v1/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMapping: { [key: string]: string } = {
      'Active': 'active',
      'Suspended': 'suspended',
      'Frozen': 'frozen'
    };

    const matchesStatus = filterStatus === 'All' || 
                         (user.accountStatus?.toLowerCase() === statusMapping[filterStatus]?.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-light text-white tracking-wide">User Management</h1>
           <p className="text-slate-400 text-sm mt-1">Manage accounts, roles, and security settings.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20 flex items-center gap-2">
           <Download className="w-4 h-4" /> Export Users
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
         {/* Filters */}
         <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/50">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-300 outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
                />
            </div>
            
            <div className="flex gap-2">
               {['All', 'Active', 'Suspended', 'Frozen'].map(status => (
                  <button 
                     key={status}
                     onClick={() => setFilterStatus(status)}
                     className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        filterStatus === status ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                     }`}
                  >
                     {status}
                  </button>
               ))}
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-950/80 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                     <th className="p-4">User Details</th>
                     <th className="p-4">Role</th>
                     <th className="p-4">Status</th>
                     <th className="p-4">KYC</th>
                     <th className="p-4">Risk Level</th>
                     <th className="p-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50 text-sm">
                   {filteredUsers.map((user) => {
                      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User';
                      const status = user.accountStatus?.charAt(0).toUpperCase() + user.accountStatus?.slice(1) || 'Active';
                      const role = user.role?.charAt(0).toUpperCase() + user.role?.slice(1).replace('_', ' ') || 'Customer';
                      
                      return (
                        <tr key={user.id} className="hover:bg-slate-800/30 transition group">
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 text-xs uppercase">
                                    {fullName.charAt(0)}{fullName.split(' ')[1]?.charAt(0) || fullName.charAt(1) || ''}
                                 </div>
                                 <div>
                                    <div className="font-medium text-white">{fullName}</div>
                                    <div className="text-slate-500 text-xs">{user.email}</div>
                                    <div className="text-slate-600 text-[10px] font-mono mt-0.5">{user.id}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="p-4 text-slate-300">{role}</td>
                           <td className="p-4">
                              <StatusBadge status={status} />
                           </td>
                           <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                                 user.email ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                 {user.email ? <UserCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                 {user.email ? 'Verified' : 'Pending'}
                              </span>
                           </td>
                           <td className="p-4">
                              <RiskBadge level={user.role === 'customer' ? 'Low' : 'Secure'} />
                           </td>
                           <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                              <button className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition" title="View Profile">
                                 <MoreHorizontal className="w-4 h-4" />
                              </button>
                               {user.accountStatus === 'active' ? (
                                  <button className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition" title="Freeze Account">
                                     <Lock className="w-4 h-4" />
                                  </button>
                               ) : (
                                  <button className="p-2 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-lg transition" title="Activate Account">
                                     <Unlock className="w-4 h-4" />
                                  </button>
                               )}
                            </div>
                         </td>
                     </tr>
                      );
                   })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
   const styles = {
      Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Frozen: "bg-red-500/10 text-red-400 border-red-500/20"
   };
   return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.Active}`}>
         {status}
      </span>
   )
}

function RiskBadge({ level }: { level: string }) {
   const styles = {
      Low: "bg-slate-800 text-slate-400 border-slate-700",
      Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      High: "bg-orange-600/10 text-orange-500 border-orange-500/20",
      Critical: "bg-red-600/10 text-red-500 border-red-500/20 animate-pulse"
   };
   return (
      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${styles[level as keyof typeof styles]}`}>
         {level}
      </span>
   )
}
