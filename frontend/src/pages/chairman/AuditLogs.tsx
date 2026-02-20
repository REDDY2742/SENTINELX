import { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2 } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/admin/audit-logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
    );
  }

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-light text-white tracking-wide">Audit Trail</h1>
             <p className="text-slate-400 text-sm mt-1">Immutable record of all administrative actions.</p>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition border border-slate-700 flex items-center gap-2">
             <Download className="w-4 h-4" /> Export Report
          </button>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-950/50">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="Search logs..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-300 outline-none focus:border-indigo-500 transition placeholder:text-slate-600"
                />
             </div>
             <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Filter className="w-4 h-4" />
                <span>Filter by Date</span>
             </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-950/80 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                      <th className="p-4">Log ID</th>
                      <th className="p-4">Admin User</th>
                      <th className="p-4">Action Performed</th>
                      <th className="p-4">Target Resource</th>
                      <th className="p-4">Timestamp & IP</th>
                      <th className="p-4 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm">
                   {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition group">
                         <td className="p-4 font-mono text-xs text-slate-500">{log.id}</td>
                         <td className="p-4">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/30">
                                  {log.admin.charAt(0)}
                               </div>
                               <span className="text-slate-300 font-medium">{log.admin}</span>
                            </div>
                         </td>
                         <td className="p-4 text-white font-medium">{log.action}</td>
                         <td className="p-4 font-mono text-xs text-slate-400 bg-slate-950/50 px-2 py-1 rounded w-fit border border-slate-800">
                            {log.target}
                         </td>
                         <td className="p-4">
                            <div className="text-slate-300 text-xs">{log.timestamp}</div>
                            <div className="text-slate-600 text-[10px] font-mono mt-0.5">{log.ip}</div>
                         </td>
                         <td className="p-4 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${ log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20' }`}>
                               {log.status}
                            </span>
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
