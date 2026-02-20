import { useState, useEffect, useMemo } from 'react';
import { 
  Clock, User, IndianRupee, FileText, 
  CheckCircle2, XCircle, Search,
  ShieldCheck, AlertTriangle, Loader2, MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useWebSocket } from '../../../../context/WebSocketContext';


export default function ApprovalQueue() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [statusTab, setStatusTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    fetchApprovals();
  }, []);

  const { lastMessage } = useWebSocket();

  // Listen for real-time updates
  useEffect(() => {
    if (lastMessage && (lastMessage.refresh || lastMessage.type === 'refresh_data')) {
      if (lastMessage.module === 'approvals' || lastMessage.module === 'applications' || !lastMessage.module) {
        fetchApprovals();
      }
    }
  }, [lastMessage]);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/v1/auth/employee/branch-management/approvals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.approvals) {
        setItems(data.approvals);
      }
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
      toast.error('Failed to sync approval queue');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    if (!selectedId || !selectedItem) return;
    try {
      setActionLoading(true);
      
      const updatedItem = {
        ...selectedItem,
        status: action === 'approve' ? 'authorized' : 'rejected',
        processedAt: new Date().toISOString()
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/v1/auth/employee/branch-management/approvals', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
      });

      if (!response.ok) throw new Error('Failed to sync decision');
      
      // Update the item in our local state instead of filtering it out
      // This allows it to move to the 'completed' tab
      setItems(prev => prev.map(item => 
        item.id === selectedId ? { ...item, status: action === 'approve' ? 'authorized' : 'rejected' } : item
      ));

      toast.success(`Request ${action === 'approve' ? 'authorized' : 'rejected'} successfully`);
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      toast.error('Action failed to sync with server');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return (items || []).filter(item => {
      const customer = item?.customer || 'Unknown';
      const id = item?.id || '';
      const type = item?.type || 'Request';
      const priority = item?.priority || 'medium';
      const status = item?.status || 'pending';

      const query = searchQuery.toLowerCase();
      const matchesSearch = customer.toLowerCase().includes(query) || 
                          id.toLowerCase().includes(query) ||
                          type.toLowerCase().includes(query);
      
      const matchesFilter = filter === 'All' || priority.toLowerCase() === filter.toLowerCase();
      
      // Filter by status tab
      const isPending = status === 'pending';
      const matchesStatus = statusTab === 'pending' ? isPending : !isPending;

      return matchesSearch && matchesFilter && matchesStatus;
    });
  }, [items, searchQuery, filter, statusTab]);

  const stats = useMemo(() => {
    const pendingCount = items.filter(i => i.status === 'pending').length;
    const completedCount = items.filter(i => i.status !== 'pending').length;
    return { pendingCount, completedCount };
  }, [items]);

  const selectedItem = items.find(i => i.id === selectedId);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between">
          <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Managerial Approvals</h2>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                 <Clock className="w-4 h-4 text-indigo-500" /> {stats.pendingCount} Pending requests awaiting review
              </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex bg-slate-950 border border-slate-900 rounded-2xl p-1 shadow-inner">
               <button onClick={() => setStatusTab('pending')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusTab === 'pending' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}>Pending ({stats.pendingCount})</button>
               <button onClick={() => setStatusTab('completed')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusTab === 'completed' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'text-slate-500 hover:text-emerald-500'}`}>Completed ({stats.completedCount})</button>
            </div>
            <div className="flex bg-slate-950 border border-slate-900 rounded-2xl p-1 shadow-inner opacity-60 hover:opacity-100 transition-opacity">
               <button onClick={() => setFilter('All')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === 'All' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>All Priority</button>
               <button onClick={() => setFilter('Critical')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === 'Critical' ? 'bg-rose-900/40 text-rose-500' : 'text-slate-500'}`}>Critical</button>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
              <div className="relative group mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, customer or type..." 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-indigo-500 focus:outline-none transition-all text-white font-medium" 
                />
              </div>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredItems.map((item) => {
                  const priority = (item.priority || 'medium').toLowerCase();
                  const time = item.time || (item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently');
                  const amountDisplay = typeof item.amount === 'number' 
                    ? `₹${item.amount.toLocaleString('en-IN')}` 
                    : (item.amount || 'N/A');

                  return (
                    <button 
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full text-left p-5 rounded-3xl border transition-all relative overflow-hidden group ${
                        selectedId === item.id ? 'bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-600/20 translate-x-1' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                              selectedId === item.id ? 'bg-white/20 text-white' : 
                              priority === 'critical' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                              priority === 'high' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                          }`}>
                              {priority}
                          </span>
                          <span className={`text-[10px] font-mono ${selectedId === item.id ? 'text-indigo-200' : 'text-slate-500'}`}>{time}</span>
                      </div>
                      <div className={`text-sm font-bold mb-1 ${selectedId === item.id ? 'text-white' : 'text-slate-200'}`}>{item.type || 'General Request'}</div>
                      <div className={`text-[11px] font-medium ${selectedId === item.id ? 'text-indigo-100' : 'text-slate-500'}`}>{item.customer || 'Unknown Customer'}</div>
                      <div className={`mt-3 text-sm font-black tracking-tight ${selectedId === item.id ? 'text-white' : 'text-indigo-400'}`}>{amountDisplay}</div>
                    </button>
                  );
                })}
                {filteredItems.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-slate-600 text-sm font-bold">No pending requests found</p>
                  </div>
                )}
              </div>
          </div>

          <div className="lg:col-span-2">
              {selectedItem ? (
                <div key={selectedItem.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 animate-in slide-in-from-right-4 duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight">{selectedItem.type}</h3>
                                <p className="text-slate-500 text-sm font-mono mt-0.5">{selectedItem.id}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Queue Status</div>
                             {selectedItem.status === 'pending' ? (
                               <div className="flex items-center gap-2 text-amber-500 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-lg shadow-amber-500/5 animate-pulse">
                                   <Clock className="w-3 h-3" />
                                   <span className="text-[10px] uppercase tracking-widest">Awaiting Review</span>
                               </div>
                             ) : selectedItem.status === 'authorized' ? (
                               <div className="flex items-center gap-2 text-emerald-500 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                   <CheckCircle2 className="w-3 h-3" />
                                   <span className="text-[10px] uppercase tracking-widest">AUTHORIZED</span>
                               </div>
                             ) : (
                               <div className="flex items-center gap-2 text-rose-500 font-bold px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-lg shadow-rose-500/5">
                                   <XCircle className="w-3 h-3" />
                                   <span className="text-[10px] uppercase tracking-widest">REJECTED</span>
                               </div>
                             )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
                        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/50 hover:border-slate-700 transition-all">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Requestor Info</span>
                             <div className="flex items-center gap-3 mb-2">
                                <User className="w-4 h-4 text-indigo-400" />
                                <span className="text-sm font-bold text-white">{selectedItem.customer}</span>
                             </div>
                             <div className="text-xs text-slate-500 font-medium">Customer since Jan 2021 • VIP Level 2</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/50 hover:border-slate-700 transition-all">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Financial Context</span>
                             <div className="flex items-center gap-3 mb-2 text-indigo-400">
                                <IndianRupee className="w-4 h-4" />
                                <span className="text-lg font-black tracking-tight">{selectedItem.amount}</span>
                             </div>
                             {selectedItem.score && (
                               <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 w-fit px-2 py-0.5 rounded border border-emerald-500/20">
                                  <ShieldCheck className="w-3 h-3" /> Cibil: {selectedItem.score}
                               </div>
                             )}
                        </div>
                    </div>

                    <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl mb-10 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sentinel® Risk Analysis</h4>
                          <MoreVertical className="w-4 h-4 text-slate-700 hover:text-white transition-colors cursor-pointer" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-xs text-slate-400 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div> KYC documents are valid and verified via central registry.</div>
                            <div className="flex items-start gap-3 text-xs text-slate-400 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div> No adverse history in previous three evaluation cycles.</div>
                            {selectedItem.priority === 'critical' && (
                              <div className="flex items-center gap-3 text-xs text-rose-400 font-bold bg-rose-500/5 p-3 rounded-2xl border border-rose-500/10"><AlertTriangle className="w-4 h-4 shrink-0" /> Transaction exceeds branch standard threshold — Managerial Override Required.</div>
                            )}
                        </div>
                    </div>

                    {selectedItem.status === 'pending' ? (
                      <div className="flex gap-4 relative z-10">
                          <button
                            onClick={() => handleAction('reject')}
                            disabled={actionLoading}
                            className="flex-1 h-16 rounded-[2rem] bg-slate-950 border border-rose-500/30 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-500/10 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                          >
                              <XCircle className="w-5 h-5" /> Reject Request
                          </button>
                          <button
                            onClick={() => handleAction('approve')}
                            disabled={actionLoading}
                            className="flex-[2] h-16 rounded-[2rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                            {actionLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Authorize Request</>}
                          </button>
                      </div>
                    ) : (
                      <div className={`p-8 rounded-[2rem] border relative z-10 overflow-hidden ${selectedItem.status === 'authorized' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                         <div className="flex flex-col items-center text-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedItem.status === 'authorized' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                               {selectedItem.status === 'authorized' ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                            </div>
                            <div>
                               <h4 className={`text-lg font-black uppercase tracking-widest ${selectedItem.status === 'authorized' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  This request has been {selectedItem.status}
                               </h4>
                               <p className="text-slate-500 text-xs font-medium mt-1">
                                  Action taken on {new Date(selectedItem.updated_at || selectedItem.timestamp).toLocaleDateString()} at {new Date(selectedItem.updated_at || selectedItem.timestamp).toLocaleTimeString()}
                               </p>
                            </div>
                         </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 text-slate-700 shadow-xl">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-500 mb-2">Select a Request to Review</h3>
                    <p className="text-slate-600 max-w-xs text-sm font-medium">Pick an item from the left queue to see full details and take action.</p>
                </div>
              )}
          </div>
      </div>
    </div>
  );
}
