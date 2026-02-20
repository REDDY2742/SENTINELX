import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, Plus, Pin, Calendar, Bell,
  ChevronRight, ArrowUpRight, MessageSquare, 
  FileText, Users, Bookmark, Loader2, X,
  ShieldAlert, Info, CheckCircle2, Trash2, Printer
} from 'lucide-react';

export default function InternalNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Notices');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [newNotice, setNewNotice] = useState({ title: '', category: 'General', priority: 'Medium', content: '' });
  const [posting, setPosting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  useEffect(() => {
    fetchNotices();
    const saved = localStorage.getItem('saved_notices');
    if (saved) setSavedIds(JSON.parse(saved));
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://13.201.79.48:8000/api/v1/auth/employee/administration/notices', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotices(data.notices || []);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    
    setPosting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://13.201.79.48:8000/api/v1/auth/employee/administration/notices', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newNotice, archived: false })
      });
      
      if (response.ok) {
        setShowPostModal(false);
        setNewNotice({ title: '', category: 'General', priority: 'Medium', content: '' });
        fetchNotices();
      }
    } catch (err) {
      console.error('Failed to post notice:', err);
    } finally {
      setPosting(false);
    }
  };

  const toggleSave = (id: string) => {
    const newSaved = savedIds.includes(id) 
      ? savedIds.filter(i => i !== id) 
      : [...savedIds, id];
    setSavedIds(newSaved);
    localStorage.setItem('saved_notices', JSON.stringify(newSaved));
  };

  const togglePin = async (notice: any) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch('http://13.201.79.48:8000/api/v1/auth/employee/administration/notices', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...notice, pinned: !notice.pinned })
      });
      fetchNotices();
    } catch (err) {
      console.error('Failed to pin:', err);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://13.201.79.48:8000/api/v1/auth/employee/administration/notices/${noticeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchNotices();
      }
    } catch (err) {
      console.error('Failed to delete notice:', err);
    }
  };

  const handlePrint = (notice: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${notice.title} - Official Circular</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: bold; color: #6366f1; margin: 0; }
            .meta { display: flex; gap: 20px; font-size: 12px; color: #64748b; margin-bottom: 40px; background: #f8fafc; padding: 15px; border-radius: 8px; }
            .content { font-size: 16px; line-height: 1.6; white-space: pre-wrap; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Official Administrative Circular</h1>
            <div style="text-align: right">
              <div style="font-weight: bold">SENTINEL X</div>
              <div style="font-size: 10px">Admin Desk: Madurai Branch</div>
            </div>
          </div>
          <div class="meta">
              <div><strong>ID:</strong> ${notice.id}</div>
              <div><strong>CATEGORY:</strong> ${notice.category}</div>
              <div><strong>DATE:</strong> ${notice.date}</div>
              <div><strong>PRIORITY:</strong> ${notice.priority}</div>
          </div>
          <h2 style="margin-top: 0">${notice.title}</h2>
          <div class="content">${notice.content || "Administrative content regarding " + notice.title + ". Please refer to the official circular handbook for detailed implementation steps and policy alignment."}</div>
          <div class="footer">
            This is an electronically generated official communication. Unauthorized reproduction or dissemination is strictly prohibited. © ${new Date().getFullYear()} Sentinel X.
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredNotices = useMemo(() => {
    const filtered = notices.filter(n => {
      const matchesCategory = activeCategory === 'All Notices' || n.category === activeCategory;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort: Pinned notices first
    return [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notices, activeCategory, searchQuery]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <Bell className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Internal Communications</h2>
                  <p className="text-slate-500 text-sm mt-1">Official notices, circulars, and departmental updates</p>
              </div>
          </div>
          <button 
            onClick={() => setShowPostModal(true)}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
             <Plus className="w-5 h-5" /> Post Announcement
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800/50 pb-4">Notice Categories</h3>
                  <div className="space-y-4">
                      {['All Notices', 'Compliance', 'IT & Operations', 'HR Announcements', 'General'].map((d) => (
                        <button 
                          key={d} 
                          onClick={() => setActiveCategory(d)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeCategory === d ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
                        >
                            {d}
                        </button>
                      ))}
                  </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><MessageSquare className="w-12 h-12 text-indigo-400" /></div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Live Updates</h4>
                  <div className="text-4xl font-black text-white">{filteredNotices.length.toString().padStart(2, '0')}</div>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">Recent Notifications <ArrowUpRight className="w-3 h-3" /></p>
              </div>
          </div>

          {/* Main List */}
          <div className="lg:col-span-3">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 overflow-hidden">
                  <div className="flex gap-4 mb-10">
                       <div className="flex-1 relative">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                           <input 
                             placeholder="Search notices or circular IDs..." 
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                             className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all px-4" 
                           />
                       </div>
                  </div>

                  <div className="space-y-4">
                      {filteredNotices.length === 0 ? (
                        <div className="py-20 text-center">
                            <Info className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">No matching notices found</p>
                        </div>
                      ) : filteredNotices.map((n) => (
                        <div key={n.id} className={`group bg-slate-950/30 border transition-all duration-300 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden ${n.pinned ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
                            <div className="flex flex-col items-center gap-1.5">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                                    n.priority === 'Critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 
                                    n.priority === 'High' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                    'bg-slate-800/10 border-slate-700/50 text-slate-500'
                                }`}>
                                    {n.priority === 'Critical' ? <ShieldAlert className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                </div>
                                {n.pinned && <Pin className="w-2.5 h-2.5 text-indigo-500 fill-indigo-500" />}
                            </div>
                            
                            <div className="flex-1 cursor-pointer" onClick={() => setSelectedNotice(n)}>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{n.category}</span>
                                    <span className="w-0.5 h-0.5 rounded-full bg-slate-700"></span>
                                    <span className="text-[8px] font-mono text-slate-600 font-bold">{n.id}</span>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors leading-snug">{n.title}</h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{n.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Users className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{n.reads} Reads</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setSelectedNotice(n)}
                                  title="View Details"
                                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-indigo-500/50 transition-all"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => togglePin(n)}
                                  title={n.pinned ? "Unpin Notice" : "Pin to Top"}
                                  className={`p-2 rounded-lg border transition-all ${n.pinned ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-indigo-400'}`}
                                >
                                    <Pin className={`w-3.5 h-3.5 ${n.pinned ? 'fill-white' : ''}`} />
                                </button>
                                <button 
                                  onClick={() => toggleSave(n.id)}
                                  title="Save Bookmark"
                                  className={`p-2 rounded-lg border transition-all ${savedIds.includes(n.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-indigo-400'}`}
                                >
                                    <Bookmark className={`w-3.5 h-3.5 ${savedIds.includes(n.id) ? 'fill-white' : ''}`} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteNotice(n.id); }}
                                  title="Delete Notice"
                                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-500 hover:border-rose-500/50 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                      ))}
                  </div>

              </div>
          </div>
      </div>

      {/* View Notice Detail Modal */}
      {selectedNotice && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
                <button 
                  onClick={() => setSelectedNotice(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                            {selectedNotice.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{selectedNotice.id}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                        {selectedNotice.title}
                    </h3>

                    <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><Calendar className="w-4 h-4" /></div>
                            <div>
                                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Published On</p>
                                <p className="text-xs font-bold text-slate-300">{selectedNotice.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><Users className="w-4 h-4" /></div>
                            <div>
                                <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Total Visibility</p>
                                <p className="text-xs font-bold text-slate-300">{selectedNotice.reads} Active Readers</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 text-slate-400 text-sm leading-relaxed mb-10 min-h-[150px]">
                        {selectedNotice.content || "Administrative content regarding " + selectedNotice.title + ". Please refer to the official circular handbook for detailed implementation steps and policy alignment."}
                    </div>

                    <div className="flex gap-4">
                        <button 
                          onClick={() => setSelectedNotice(null)}
                          className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Understood
                        </button>
                        <button 
                          onClick={() => handlePrint(selectedNotice)}
                          className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm hover:text-white transition-all flex items-center gap-2"
                        >
                           <Printer className="w-4 h-4" /> Print Circular
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* Post New Announcement Modal */}
      {showPostModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-8 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white flex items-center gap-3">
                       <Plus className="w-5 h-5 text-indigo-500" /> New Announcement
                    </h3>
                    <button onClick={() => setShowPostModal(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handlePostNotice} className="p-8 space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Announcement Title</label>
                        <input 
                          type="text" 
                          required
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                          placeholder="e.g., Mandatory Security Drill - Feb 20" 
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Category</label>
                            <div className="relative">
                                <button 
                                  type="button"
                                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between hover:border-indigo-500/50 transition-all"
                                >
                                    <span className={newNotice.category ? 'text-white' : 'text-slate-500'}>
                                        {newNotice.category || 'Select Category'}
                                    </span>
                                    <Plus className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showCategoryDropdown ? 'rotate-45 text-indigo-500' : ''}`} />
                                </button>

                                {showCategoryDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-[110]" onClick={() => setShowCategoryDropdown(false)} />
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-[120] animate-in fade-in slide-in-from-top-2 duration-200">
                                            {['General', 'Compliance', 'IT & Operations', 'HR Announcements', 'Product Updates'].map((cat) => (
                                                <button
                                                  key={cat}
                                                  type="button"
                                                  onClick={() => {
                                                      setNewNotice({...newNotice, category: cat});
                                                      setShowCategoryDropdown(false);
                                                  }}
                                                  className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all mb-1 last:mb-0"
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Priority</label>
                            <div className="relative">
                                <button 
                                  type="button"
                                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between hover:border-indigo-500/50 transition-all"
                                >
                                    <span className={newNotice.priority ? 'text-white' : 'text-slate-500'}>
                                        {newNotice.priority || 'Select Priority'}
                                    </span>
                                    <Plus className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showPriorityDropdown ? 'rotate-45 text-indigo-500' : ''}`} />
                                </button>

                                {showPriorityDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-[110]" onClick={() => setShowPriorityDropdown(false)} />
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-[120] animate-in fade-in slide-in-from-top-2 duration-200">
                                            {['Medium', 'High', 'Critical'].map((prio) => (
                                                <button
                                                  key={prio}
                                                  type="button"
                                                  onClick={() => {
                                                      setNewNotice({...newNotice, priority: prio});
                                                      setShowPriorityDropdown(false);
                                                  }}
                                                  className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all mb-1 last:mb-0"
                                                >
                                                    {prio}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Content Body</label>
                        <textarea 
                           required
                           value={newNotice.content}
                           onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                           rows={5} 
                           className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 resize-none px-4" 
                           placeholder="Describe the announcement details here..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                          type="button"
                          onClick={() => setShowPostModal(false)}
                          className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs hover:text-white transition-all uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button 
                          disabled={posting}
                          className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 uppercase tracking-widest"
                        >
                            {posting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Publish Announcement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
}
