import { useState, useEffect, useMemo } from 'react';
import { 
   Search, 
  ChevronRight, 
   ShieldAlert, Zap, Loader2, X, AlertTriangle, Send
} from 'lucide-react';
import toast from 'react-hot-toast';

const defaultEscalations = [
  { id: 'ESC-842', customer: 'Ananya Sharma', type: 'Wealth Mgmt', priority: 'Urgent', status: 'Pending', time: '14 mins ago', sentiment: 'Critical' },
  { id: 'ESC-841', customer: 'Vikram Malhotra', type: 'Loan Repayment', priority: 'High', status: 'In Review', time: '1 hour ago', sentiment: 'Negative' },
  { id: 'ESC-839', customer: 'Suresh Kumar', type: 'Credit Card Fraud', priority: 'Critical', status: 'Active', time: '2 hours ago', sentiment: 'Escalated' },
  { id: 'ESC-838', customer: 'Priya Iyer', type: 'Account Access', priority: 'Medium', status: 'Resolved', time: '3 hours ago', sentiment: 'Neutral' },
  { id: 'ESC-835', customer: 'Rohan Mehra', type: 'Transaction Failure', priority: 'High', status: 'Active', time: '5 hours ago', sentiment: 'Negative' },
];

export default function EscalationsDesk() {
  const [escalations, setEscalations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    customer: '',
    type: 'Transaction Failure',
    priority: 'Urgent',
    sentiment: 'Negative'
  });

  useEffect(() => {
    fetchEscalations();
  }, []);

  const fetchEscalations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/v1/auth/employee/branch-management/escalations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.escalations && data.escalations.length > 0) {
        setEscalations(data.escalations);
      } else {
        setEscalations(defaultEscalations);
      }
    } catch (err) {
      console.error('Failed to fetch escalations:', err);
      setEscalations(defaultEscalations);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEscalation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      const newEsc = { 
        ...formData, 
        id: `ESC-${Math.floor(Math.random() * 900 + 100)}`,
        status: 'Pending',
        time: 'Just now'
      };
      
      const response = await fetch('http://localhost:8000/api/v1/auth/employee/branch-management/escalations', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEsc)
      });
      
      if (response.ok) {
        toast.success('Escalation ticket filed');
        setShowAddModal(false);
        fetchEscalations();
      }
    } catch (err) {
      toast.error('Failed to file escalation');
    } finally {
      setSaving(false);
    }
  };

  const filteredEscalations = useMemo(() => {
    return escalations.filter(esc => 
      esc.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
      esc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      esc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [escalations, searchQuery]);

  const activeCount = useMemo(() => escalations.filter(e => e.status !== 'Resolved').length, [escalations]);

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
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 text-rose-500">
                  <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Escalations Desk</h2>
                  <p className="text-slate-500 text-sm mt-1">High-priority customer grievances requiring management intervention</p>
              </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3.5 bg-rose-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center gap-2"
          >
              <AlertTriangle className="w-4 h-4" /> File Escalation
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8">
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                      <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search complaints by Ref ID, Name or Keyword..." 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
                          />
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{activeCount} Active Issues</span>
                      </div>
                  </div>

                  <div className="overflow-x-auto">
                      <table className="w-full">
                          <thead>
                              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                                  <th className="text-left px-6 py-4">Complaint Reference</th>
                                  <th className="text-left px-6 py-4">Department</th>
                                  <th className="text-center px-6 py-4">Sentiment</th>
                                  <th className="text-center px-6 py-4">Wait Time</th>
                                  <th className="text-center px-6 py-4">Status</th>
                                  <th className="w-10"></th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/30">
                              {filteredEscalations.map((esc) => (
                                <tr key={esc.id} className="group hover:bg-slate-800/20 transition-all duration-300">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-400 group-hover:border-rose-500/50 transition-all group-hover:text-rose-500">
                                                {esc.id.split('-')[1]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white leading-none">{esc.customer}</div>
                                                <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">{esc.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-xs text-slate-400 font-medium whitespace-nowrap">
                                        {esc.type}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                            esc.sentiment === 'Critical' ? 'text-rose-500' :
                                            esc.sentiment === 'Escalated' ? 'text-amber-500' :
                                            esc.sentiment === 'Negative' ? 'text-orange-400' : 'text-slate-500'
                                        }`}>
                                            {esc.sentiment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                        {esc.time}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                esc.status === 'Resolved' ? 'bg-emerald-500' :
                                                esc.status === 'Active' ? 'bg-indigo-500' :
                                                esc.status === 'Pending' ? 'bg-rose-500' : 'bg-amber-500'
                                            }`}></div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">{esc.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-rose-400 hover:border-rose-500/50 transition-all">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">Live Status</h3>
                  <div className="space-y-6 mt-8">
                      <div className="p-6 rounded-[2rem] bg-slate-950/60 border border-slate-800 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-bl-full blur-xl"></div>
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Urgency Ratio</h4>
                           <div className="flex items-end justify-between">
                               <div className="text-4xl font-black text-white leading-none">74<span className="text-rose-500 text-xl">%</span></div>
                               <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">Protocol Red <Zap className="w-3 h-3" /></button>
                           </div>
                           <div className="mt-6 h-1 w-full bg-slate-800 rounded-full">
                               <div className="h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]" style={{ width: '74%' }}></div>
                           </div>
                      </div>

                      <div className="p-6 rounded-[2rem] bg-slate-950/60 border border-slate-800 group transition-all hover:border-indigo-500/30">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Queue Composition</h4>
                           <div className="space-y-4">
                               <div className="flex justify-between items-center text-xs">
                                   <div className="flex items-center gap-3">
                                       <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                       <span className="font-bold text-slate-400">Wealth Accounts</span>
                                   </div>
                                   <span className="font-black text-white">08</span>
                               </div>
                               <div className="flex justify-between items-center text-xs">
                                   <div className="flex items-center gap-3">
                                       <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                       <span className="font-bold text-slate-400">Corporate Loans</span>
                                   </div>
                                   <span className="font-black text-white">12</span>
                               </div>
                               <div className="flex justify-between items-center text-xs">
                                   <div className="flex items-center gap-3">
                                       <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                       <span className="font-bold text-slate-400">Retail Grid</span>
                                   </div>
                                   <span className="font-black text-white">24</span>
                               </div>
                           </div>
                      </div>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[3rem] shadow-2xl shadow-indigo-600/20">
                  <h4 className="text-lg font-black text-white leading-tight mb-3">Management Callback Protocol</h4>
                  <p className="text-indigo-100/90 text-[10px] font-medium leading-relaxed mb-8">Direct high-net-worth customer escalations to the management team for immediate resolution and retention priority.</p>
                  <button className="w-full py-4 bg-white text-indigo-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                      Access Callback List
                  </button>
              </div>
          </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">File Escalation</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all"><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <form onSubmit={handleAddEscalation} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Customer Name</label>
                <input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} placeholder="e.g. Rajesh Kumar" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department/Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none">
                    <option>Wealth Mgmt</option>
                    <option>Loan Repayment</option>
                    <option>Credit Card Fraud</option>
                    <option>Account Access</option>
                    <option>Transaction Failure</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none">
                    <option>Urgent</option>
                    <option>High</option>
                    <option>Critical</option>
                    <option>Medium</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sentiment</label>
                  <select value={formData.sentiment} onChange={e => setFormData({...formData, sentiment: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none">
                    <option>Critical</option>
                    <option>Negative</option>
                    <option>Escalated</option>
                    <option>Neutral</option>
                  </select>
                </div>
              </div>
              <button disabled={saving} type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Deploy Incident Unit</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
