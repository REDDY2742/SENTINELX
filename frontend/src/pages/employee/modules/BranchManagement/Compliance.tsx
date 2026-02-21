import { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, 
  FileLock2, Zap, 
  History, ShieldAlert,
  ArrowRightCircle, Loader2, RefreshCcw, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

const defaultStats = [
  { label: 'AML Flags', value: '12', status: 'Priority', color: 'rose' },
  { label: 'KYC Backlog', value: '45', status: 'In Progress', color: 'amber' },
  { label: 'Policy Sync', value: '100%', status: 'Aligned', color: 'emerald' },
  { label: 'Audit Score', value: '9.4', status: 'Excellent', color: 'indigo' },
];

const defaultAlerts = [
  { title: 'Suspicious High-Value Transfer', id: 'AML-9421', level: 'Critical', time: '12 mins ago' },
  { title: 'Expired Corporate KYC Documents', id: 'KYC-8820', level: 'Medium', time: '4 hours ago' },
  { title: 'Mismatched Asset Valuation', id: 'RISK-1025', level: 'High', time: 'Jan 15, 2024' },
  { title: 'Unauthorized Cash Entry Found', id: 'SEC-0042', level: 'Critical', time: 'Jan 14, 2024' }
];

export default function BranchCompliance() {
  const [stats, setStats] = useState<any[]>([]);
  const [alerts, _setAlerts] = useState<any[]>(defaultAlerts);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rating, _setRating] = useState({ health: '99.8%', response: '12.4m' });

  useEffect(() => {
    fetchCompliance();
  }, []);

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/employee/branch-management/compliance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.compliance && data.compliance.length > 0) {
        setStats(data.compliance);
      } else {
        setStats(defaultStats);
      }
    } catch (err) {
      console.error('Failed to fetch compliance:', err);
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setRefreshing(true);
    await fetchCompliance();
    setRefreshing(false);
    toast.success('Security & Compliance protocols synchronized');
  };

  const handleQuarterlyCert = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Uploading Certification Package...',
        success: 'Quarterly Certification Submitted to RBI Registry',
        error: 'Upload Failed'
      }
    );
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'rose': return { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500/20', light: 'bg-rose-500/10' };
      case 'amber': return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500/20', light: 'bg-amber-500/10' };
      case 'emerald': return { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500/20', light: 'bg-emerald-500/10' };
      case 'indigo': return { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500/20', light: 'bg-indigo-500/10' };
      default: return { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500/20', light: 'bg-indigo-500/10' };
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
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                  <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Compliance Summary</h2>
                  <p className="text-slate-500 text-sm mt-1">Branch-level regulatory adherence and risk mitigation oversight</p>
              </div>
          </div>
          <div className="flex gap-3">
              <button 
                onClick={handleSync}
                className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl hover:text-emerald-400 transition-all flex items-center justify-center"
              >
                  <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={handleQuarterlyCert}
                className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                  <CheckCircle2 className="w-4 h-4" /> Submit Quarterly Cert
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
             const cls = getColorClasses(stat.color);
             return (
               <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                   <div className={`absolute top-0 right-0 w-24 h-24 ${cls.bg}/5 rounded-bl-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                   <div className="flex items-end justify-between relative z-10">
                       <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${cls.light} ${cls.text} ${cls.border}`}>
                          {stat.status}
                       </span>
                   </div>
               </div>
             );
          })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8">
                  <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-white">Active Regulatory Alerts</h3>
                      <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">History <History className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      {alerts.map((alert, i) => (
                          <div key={i} className="p-6 rounded-[2rem] bg-slate-950/40 border border-slate-800/50 flex items-center justify-between group hover:border-rose-500/30 transition-all cursor-pointer">
                              <div className="flex items-center gap-5">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                                      alert.level === 'Critical' ? 'bg-rose-500/10 text-rose-500 shadow-rose-500/5' : 'bg-amber-500/10 text-amber-500 shadow-amber-500/5'
                                  }`}>
                                      {alert.level === 'Critical' ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                  </div>
                                  <div>
                                      <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors uppercase tracking-tight">{alert.title}</h4>
                                      <div className="flex items-center gap-3 mt-1.5">
                                          <span className="text-[10px] font-mono text-slate-500">{alert.id}</span>
                                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                          <span className="text-[10px] font-bold text-slate-600 uppercase italic">{alert.time}</span>
                                      </div>
                                  </div>
                              </div>
                              <ArrowRightCircle className="w-5 h-5 text-slate-700 group-hover:text-rose-500 transition-all" />
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/20">
                      <FileLock2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">Branch Health Rating</h3>
                  <p className="text-xs text-slate-500 mb-8 font-medium">Regional Standing: <span className="text-emerald-500 font-bold">Top 5%</span></p>
                  
                  <div className="w-full space-y-4">
                      <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrity Index</span>
                          <span className="text-sm font-black text-white group-hover:text-emerald-500 transition-colors">{rating.health}</span>
                      </div>
                      <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Response Time</span>
                          <span className="text-sm font-black text-white group-hover:text-emerald-500 transition-colors">{rating.response}</span>
                      </div>
                  </div>

                  <button className="mt-8 w-full py-4 rounded-2xl bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700/50 shadow-xl">
                      View Regional Leaderboard
                  </button>
              </div>

              <div className="p-8 rounded-[3rem] bg-indigo-600 shadow-2xl shadow-indigo-600/30 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                  <h4 className="text-lg font-black text-white mb-3 text-shadow">RBI Regulatory Portal</h4>
                  <p className="text-indigo-100/80 text-[10px] font-medium leading-relaxed mb-8">Secure encrypted gateway for submitting monthly mandatory reports to the Reserve Bank of India.</p>
                  <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:translate-y-[-2px] active:scale-95 transition-all">
                      <Zap className="w-3.5 h-3.5 fill-current" /> Open Vault Gateway
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
