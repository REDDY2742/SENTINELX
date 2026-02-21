import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ArrowUpRight, ArrowDownRight,
  BarChart3, Activity, Loader2, RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

const defaultKPIs = [
  { label: 'CASA Growth', value: '+12.5%', sub: '₹4.2M new deposits', trend: 'up', color: 'emerald' },
  { label: 'NPA Ratio', value: '1.42%', sub: 'Target: <1.50%', trend: 'down', color: 'emerald' },
  { label: 'Disbursement', value: '₹18.5M', sub: '82% of monthly target', trend: 'up', color: 'indigo' },
  { label: 'Customer CSAT', value: '4.8/5', sub: 'Based on 450 reviews', trend: 'up', color: 'amber' },
];

export default function BranchPerformance() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<any[]>([]);
  const [staffPerf, setStaffPerf] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('MTD');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/employee/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      const realKPIs = [
        { label: 'Asset Valuation', value: data.totalDeposits, sub: 'Total Inflow', trend: 'up', color: 'emerald', path: '/employee/performance' },
        { label: 'Branch Revenue', value: data.branchRevenue, sub: data.analytics?.growth || '+0%', trend: 'up', color: 'indigo', path: '/employee/targets' },
        { label: 'Operational Spend', value: data.branchExpenses, sub: 'Monthly overhead', trend: 'down', color: 'rose', path: '/employee/reports' },
        { label: 'Customer base', value: data.activeCustomers, sub: 'Active accounts', trend: 'up', color: 'amber', path: '/employee/staff' },
      ];

      setKpis(realKPIs);
      setStaffPerf(data.staff || []);
      setRevenueData(data.performanceChart || []);
    } catch (err) {
      console.error('Failed to fetch performance:', err);
      // Fallback with paths
      setKpis(defaultKPIs.map(k => ({ ...k, path: '/employee/performance' })));
      setStaffPerf([]);
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPerformance();
    setRefreshing(false);
    toast.success('Performance analytics synchronized');
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
                  <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Performance Analytics</h2>
                  <p className="text-slate-500 text-sm mt-1">Branch-wide KPIs and growth indicators</p>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh}
                className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl hover:text-indigo-400 transition-all active:rotate-180 duration-500"
              >
                <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-xl">
                  {['MTD', 'QTD', 'YTD'].map(p => (
                      <button 
                        key={p} 
                        onClick={() => setTimeRange(p)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${timeRange === p ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        {p}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
              <div 
                key={i} 
                onClick={() => navigate(kpi.path)}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                  <div className={`absolute top-0 right-0 p-4 transition-transform group-hover:scale-110 ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {kpi.trend === 'up' ? <ArrowUpRight className="w-5 h-5 shadow-emerald-500/20" /> : <ArrowDownRight className="w-5 h-5 shadow-rose-500/20" />}
                  </div>
                  <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{kpi.label}</span>
                  <div className="text-3xl font-black text-white tracking-tighter mb-2">{kpi.value}</div>
                  <p className="text-xs text-slate-500 font-medium">{kpi.sub}</p>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-white">Revenue vs Targets</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-700"></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target</span></div>
                    </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-4">
                    {revenueData.map((day, i) => (
                        <div key={i} className="flex-1 space-y-3 h-full flex flex-col justify-end">
                            <div className="relative group flex flex-col items-center gap-2 h-full">
                                <div className="w-full bg-slate-800/50 rounded-lg overflow-hidden h-full relative border border-slate-800/50">
                                    <div 
                                      className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-lg transition-all duration-1000 group-hover:bg-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]" 
                                      style={{ height: `${day.percentage}%` }}
                                      title={`Revenue: ₹${day.revenue} / Target: ₹${day.target}`}
                                    ></div>
                                    <div className="absolute bottom-[85%] left-0 right-0 h-0.5 bg-slate-600/30 border-t border-dashed border-slate-500/20"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 font-mono">{day.label}</span>
                            </div>
                        </div>
                    ))}
                    {revenueData.length === 0 && (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs italic font-mono uppercase tracking-widest bg-slate-900/20 rounded-xl">
                            Awaiting daily cycle data...
                        </div>
                    )}
                </div>
          </div>

          <div className="space-y-6">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" /> Staff Efficiency</h3>
                    <div className="space-y-6">
                        {staffPerf.map((s, i) => (
                          <div key={i} className="space-y-2 group">
                              <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-300 group-hover:text-white transition-colors">{s.name}</span>
                                  <span className="text-indigo-400">{s.efficiency}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                  <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.2)]" style={{ width: `${s.efficiency}%` }}></div>
                              </div>
                          </div>
                        ))}
                    </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[2rem] flex gap-4 hover:border-emerald-500/30 transition-all cursor-default group">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Activity className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-emerald-200 mb-1">Goal Reached</p>
                        <p className="text-[10px] text-emerald-500/80 leading-relaxed font-medium">Branch has exceeded the quarterly account opening target by 4%.</p>
                    </div>
                </div>
          </div>
      </div>
    </div>
  );
}
