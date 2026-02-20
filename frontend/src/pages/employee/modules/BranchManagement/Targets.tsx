import { useState, useEffect } from 'react';
import { 
  Target, TrendingUp, 
  ArrowUpRight, Loader2, Plus, X
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import toast from 'react-hot-toast';

const defaultData = [
  { name: 'Mon', savings: 4000, loans: 2400, kyc: 2400 },
  { name: 'Tue', savings: 3000, loans: 1398, kyc: 2210 },
  { name: 'Wed', savings: 2000, loans: 9800, kyc: 2290 },
  { name: 'Thu', savings: 2780, loans: 3908, kyc: 2000 },
  { name: 'Fri', savings: 1890, loans: 4800, kyc: 2181 },
  { name: 'Sat', savings: 2390, loans: 3800, kyc: 2500 },
  { name: 'Sun', savings: 3490, loans: 4300, kyc: 2100 },
];

const defaultTargets = [
  { id: '1', label: 'SAVINGS DEPOSITS', current: '₹4.2M', target: '₹5.0M', progress: 84, trend: '+12%', color: 'indigo' },
  { id: '2', label: 'LOAN DISBURSAL', current: '₹2.8M', target: '₹3.5M', progress: 80, trend: '+8%', color: 'emerald' },
  { id: '3', label: 'KYC COMPLIANCE', current: '942', target: '1000', progress: 94, trend: '+5%', color: 'purple' },
  { id: '4', label: 'NPA RECOVERY', current: '₹620K', target: '₹500K', progress: 124, trend: '+20%', color: 'amber' },
];

export default function TargetTracking() {
  const [targets, setTargets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    current: '',
    target: '',
    progress: 0,
    trend: '+0%',
    color: 'indigo'
  });

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/v1/auth/employee/branch-management/targets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.targets && data.targets.length > 0) {
        setTargets(data.targets);
      } else {
        setTargets(defaultTargets);
      }
    } catch (err) {
      console.error('Failed to fetch targets:', err);
      setTargets(defaultTargets);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      const newTarget = { ...formData, id: Date.now().toString() };
      const response = await fetch('http://localhost:8000/api/v1/auth/employee/branch-management/targets', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTarget)
      });
      if (response.ok) {
        toast.success('Target added successfully');
        setShowAddModal(false);
        fetchTargets();
      }
    } catch (err) {
      toast.error('Failed to add target');
    } finally {
      setSaving(false);
    }
  };

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
                  <Target className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Productivity Targets</h2>
                  <p className="text-slate-500 text-sm mt-1">Real-time tracking of branch KPIs and performance milestones</p>
              </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
              <Plus className="w-4 h-4" /> Add KPI
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {targets.map((tgt) => (
             <div key={tgt.id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                 <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{tgt.label}</p>
                        <h3 className="text-2xl font-black text-white">{tgt.current}</h3>
                     </div>
                     <div className={`p-2 rounded-xl bg-${tgt.color || 'indigo'}-500/10 text-${tgt.color || 'indigo'}-500`}>
                        <TrendingUp className="w-4 h-4" />
                     </div>
                 </div>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Progress</span>
                        <span className={`text-[10px] font-black text-indigo-500`}>{tgt.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-indigo-500 rounded-full group-hover:animate-pulse transition-all duration-1000`} 
                          style={{ width: `${Math.min(100, Number(tgt.progress))}%` }}
                        ></div>
                    </div>
                 </div>

                 <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Target: {tgt.target}</span>
                    <span className="flex items-center gap-1 text-emerald-500 font-black">
                        <ArrowUpRight className="w-3 h-3" /> {tgt.trend}
                    </span>
                 </div>
             </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8">
              <div className="flex items-center justify-between mb-10">
                  <div>
                      <h3 className="text-xl font-bold text-white leading-none">Growth Trajectory</h3>
                      <p className="text-xs text-slate-500 mt-1">Comparison across core product verticals</p>
                  </div>
              </div>

              <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={defaultData}>
                          <defs>
                              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                          <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="savings" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                          <Area type="monotone" dataKey="loans" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLoans)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8">
              <h3 className="text-xl font-bold text-white mb-8">Team Contributions</h3>
              <div className="space-y-6">
                  {[
                      { name: 'Arjun Verma', role: 'Loan Officer', score: 98, avatar: 'AV' },
                      { name: 'Sita Rani', role: 'Relationship Mgr', score: 94, avatar: 'SR' },
                      { name: 'Kunal Kapoor', role: 'Service Assoc', score: 89, avatar: 'KK' },
                      { name: 'Neha Gupta', role: 'Lead Teller', score: 82, avatar: 'NG' }
                  ].map((staff, i) => (
                      <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-indigo-400 group-hover:border-indigo-500/50 transition-all">
                                  {staff.avatar}
                              </div>
                              <div>
                                  <div className="text-sm font-bold text-white leading-none mb-1">{staff.name}</div>
                                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{staff.role}</div>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="text-sm font-black text-white">{staff.score}%</div>
                              <div className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">Efficiency</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Add New KPI</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all"><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <form onSubmit={handleAddTarget} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">KPI Label</label>
                <input required value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} placeholder="e.g. SAVINGS DEPOSITS" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Value</label>
                  <input required value={formData.current} onChange={e => setFormData({...formData, current: e.target.value})} placeholder="₹4.2M" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Value</label>
                  <input required value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} placeholder="₹5.0M" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Progress %</label>
                  <input type="number" required value={formData.progress} onChange={e => setFormData({...formData, progress: Number(e.target.value)})} placeholder="84" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Trend</label>
                  <input required value={formData.trend} onChange={e => setFormData({...formData, trend: e.target.value})} placeholder="+12%" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
              <button disabled={saving} type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create KPI Target'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
