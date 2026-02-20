import { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardList, Download, FileText,
  Search, Share2,
  MoreHorizontal, AlertCircle, Loader2, Plus, X, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const defaultReports = [
  { id: 'REP-001', title: 'Daily Cash Reconciliation', category: 'Finance', date: 'Feb 16, 2024', status: 'Verified', size: '1.2 MB' },
  { id: 'REP-002', title: 'End-of-Month Performance', category: 'Branch Operations', date: 'Jan 31, 2024', status: 'Archived', size: '4.8 MB' },
  { id: 'REP-003', title: 'NPA Movement Analysis', category: 'Credit & Risk', date: 'Feb 12, 2024', status: 'Verified', size: '2.5 MB' },
  { id: 'REP-004', title: 'Customer Acquisition Trends', category: 'Marketing', date: 'Feb 10, 2024', status: 'Generating', size: '0.8 MB' },
  { id: 'REP-005', title: 'Quarterly Audit Summary', category: 'Compliance', date: 'Dec 15, 2023', status: 'Archived', size: '12.4 MB' },
  { id: 'REP-006', title: 'Suspicious Transaction Log', category: 'Risk', date: 'Today', status: 'Priority', size: '0.4 MB' },
];

export default function BranchReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Finance',
    status: 'Verified',
    size: '1.0 MB'
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/branch-management/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.reports && data.reports.length > 0) {
        setReports(data.reports);
      } else {
        setReports(defaultReports);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setReports(defaultReports);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      const newReport = { 
        ...formData, 
        id: `REP-${Math.floor(Math.random() * 9000 + 1000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/branch-management/reports', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReport)
      });
      
      if (response.ok) {
        toast.success('Report generated successfully');
        setShowAddModal(false);
        fetchReports();
      }
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setSaving(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(rep => {
      const matchesSearch = rep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rep.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || rep.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [reports, searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      priority: reports.filter(r => r.status === 'Priority').length,
      verified: reports.filter(r => r.status === 'Verified').length
    };
  }, [reports]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <ClipboardList className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Intelligence Reports</h2>
                  <p className="text-slate-500 text-sm mt-1">Unified repository for operational, financial and compliance analytics</p>
              </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
             <Plus className="w-5 h-5" /> Schedule New Report
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5 group hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
              </div>
              <div>
                  <h4 className="text-2xl font-black text-white leading-none mb-1">{stats.total}</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Total Reports</p>
              </div>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5 group hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                  <Check className="w-6 h-6" />
              </div>
              <div>
                  <h4 className="text-2xl font-black text-white leading-none mb-1">{stats.verified}</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Verified Assets</p>
              </div>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-[2rem] flex items-center gap-5 group hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                  <h4 className="text-2xl font-black text-white leading-none mb-1">{stats.priority}</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">High Priority</p>
              </div>
          </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8">
           <div className="flex flex-col md:flex-row gap-4 mb-10">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search reports by title, ID or category..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
                   />
               </div>
               <div className="flex gap-2">
                   <select 
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 font-bold text-xs outline-none focus:text-white transition-all appearance-none cursor-pointer"
                   >
                       <option>All</option>
                       <option>Finance</option>
                       <option>Branch Operations</option>
                       <option>Credit & Risk</option>
                       <option>Marketing</option>
                   </select>
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                   <div key={report.id} className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] group hover:border-indigo-500/50 transition-all hover:bg-slate-900/40">
                       <div className="flex justify-between items-start mb-6">
                           <div className={`p-3 rounded-2xl bg-indigo-500/10 text-indigo-500`}>
                               <FileText className="w-6 h-6" />
                           </div>
                           <div className="flex gap-2">
                               <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
                               <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                           </div>
                       </div>
                       
                       <div className="space-y-1 mb-8">
                           <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{report.title}</h4>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{report.category} • {report.id}</p>
                       </div>

                       <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                           <div className="space-y-1">
                               <div className="text-[10px] font-bold text-slate-600 uppercase">Generated On</div>
                               <div className="text-xs font-bold text-slate-400">{report.date}</div>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                               report.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                               report.status === 'Priority' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                               report.status === 'Archived' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                               'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                           }`}>
                               {report.status}
                           </span>
                       </div>

                       <div className="mt-6">
                           <button className="w-full py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-600 transition-all flex items-center justify-center gap-2">
                               <Download className="w-3.5 h-3.5" /> Download PDF ({report.size})
                           </button>
                       </div>
                   </div>
                ))}
           </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Schedule Report</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all"><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <form onSubmit={handleAddReport} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Report Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Monthly Risk Assessment" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none">
                    <option>Finance</option>
                    <option>Branch Operations</option>
                    <option>Credit & Risk</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none">
                    <option>Verified</option>
                    <option>Priority</option>
                    <option>Generating</option>
                  </select>
                </div>
              </div>
              <button disabled={saving} type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Schedule Generation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
