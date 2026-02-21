import { useState, useEffect } from 'react';
import { 
  BarChart3, Users, CalendarClock, 
  Package, Truck, Bell, 
  ArrowUpRight, Loader2, ArrowRight, Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '@/lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 7 Days');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/employee/administration/overview`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch admin overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const chartData = data?.chartData || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Administration Overview</h2>
                  <p className="text-slate-500 text-sm mt-1">Global command center for branch resources, logistics and personnel</p>
              </div>
          </div>
          <div className="flex gap-3">
              <button className="bg-slate-900 text-slate-300 px-6 py-3 rounded-2xl font-bold border border-slate-800 hover:bg-slate-800 transition-all">
                  Download Report
              </button>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                  Admin Settings
              </button>
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Personnel" 
            value={data?.summary?.staff || '0'} 
            sub="Active Employees" 
            icon={<Users className="w-5 h-5" />} 
            color="indigo" 
          />
          <StatCard 
            title="Leave Requests" 
            value={data?.summary?.pendingLeave || '0'} 
            sub="Pending Approval" 
            icon={<CalendarClock className="w-5 h-5" />} 
            color="amber" 
          />
          <StatCard 
            title="Asset Valuation" 
            value={data?.summary?.assetsValue || '₹0'} 
            sub="Branch Inventory" 
            icon={<Package className="w-5 h-5" />} 
            color="emerald" 
          />
          <StatCard 
            title="Active Vendors" 
            value={data?.summary?.activeVendors || '0'} 
            sub="Contracted Partners" 
            icon={<Truck className="w-5 h-5" />} 
            color="purple" 
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
              <div className="flex justify-between items-start mb-8">
                  <div>
                      <h3 className="text-lg font-bold text-white">Administrative Activity</h3>
                      <p className="text-xs text-slate-500">Resource allocation vs Personnel actions</p>
                  </div>
                  <div className="relative">
                      <button 
                        onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                        className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 rounded-xl px-4 py-2 flex items-center gap-2 hover:border-indigo-500/50 transition-all"
                      >
                          {selectedTimeRange}
                          <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${isTimeDropdownOpen ? 'rotate-45 text-indigo-500' : ''}`} />
                      </button>

                      {isTimeDropdownOpen && (
                          <>
                              <div className="fixed inset-0 z-[110]" onClick={() => setIsTimeDropdownOpen(false)} />
                              <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-[120] min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-200">
                                  {['Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map((range) => (
                                      <button
                                        key={range}
                                        onClick={() => {
                                            setSelectedTimeRange(range);
                                            setIsTimeDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                                      >
                                          {range}
                                      </button>
                                  ))}
                              </div>
                          </>
                      )}
                  </div>
              </div>
              <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                          <defs>
                              <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="activity" stroke="#6366f1" fill="url(#adminGrad)" strokeWidth={3} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Recent Notices */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                      <Bell className="w-5 h-5 text-indigo-500" /> Latest Notices
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </div>
              <div className="space-y-6">
                  {data?.recentNotices?.map((n: any) => (
                    <div key={n.id} className="group cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{n.category}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="text-[10px] text-slate-500">{n.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{n.title}</h4>
                    </div>
                  ))}
                  <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all">
                      View All Communication <ArrowRight className="w-3.5 h-3.5" />
                  </button>
              </div>
          </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Quick Access Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickLink title="Personnel" icon={<Users />} count={data?.summary?.staff} path="/employee/staff-records" />
              <QuickLink title="Leave Management" icon={<CalendarClock />} count={data?.summary?.totalLeave} path="/employee/leave" />
              <QuickLink title="Asset Registry" icon={<Package />} count={data?.summary?.totalAssets} path="/employee/assets" />
              <QuickLink title="Vendor Portal" icon={<Truck />} count={data?.summary?.totalVendors} path="/employee/vendors" />
          </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon, color }: any) {
  const colors: any = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-[2rem] p-7 transition-all duration-300 hover:scale-[1.02]`}>
        <div className="w-10 h-10 rounded-xl bg-slate-950/50 flex items-center justify-center mb-6">
            {icon}
        </div>
        <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
        <div className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-none mb-2">{title}</div>
        <div className="text-[10px] font-medium text-slate-500 italic">{sub}</div>
    </div>
  );
}

function QuickLink({ title, icon, count, path }: any) {
    return (
        <a href={path} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950/30 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{title}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{count} Active Records</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-800 group-hover:text-indigo-500 transition-all ml-auto" />
        </a>
    );
}
