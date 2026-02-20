import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, TrendingUp, 
  Activity, Clock, CheckCircle, Loader2, ArrowRight,
  Wallet, Banknote, Users, FileText,
  ShieldCheck,
  MessageSquare, UserCheck
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import BranchManagerOverview from './roles/branch_manager/BranchOverview';

export default function EmployeeDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        // Fetch User Info
        const userRes = await fetch('https://13.201.79.48:8000/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();
        setUser(userData);

        // Fetch Dashboard Stats
        const statsRes = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        setStats(statsData);
      } catch (err) {
        console.error('Dashboard data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
     return (
        <div className="h-[70vh] flex items-center justify-center">
           <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Initializing Analytical Engine...</p>
           </div>
        </div>
     );
  }

  const role = user?.role || '';
  
  // Render specialized dashboard for branch manager
  if (role === 'branch_manager') {
    return <BranchManagerOverview stats={stats} user={user} />;
  }

  // Role Grouping Logic for other roles
  const isAsstManager = role === 'assistant_manager';
  const isTeller = role === 'teller';
  const isCashier = role === 'cashier';
  const isLoanOfficer = role === 'loan_officer';
  const isRelationShip = role === 'relationship_manager';
  const isCustomerService = role === 'customer_service';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
              <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                      {role.replace('_', ' ')}
                  </span>
                  <span className="text-slate-600 text-[10px] font-mono">• {user?.branchId || 'HQ'}</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                  Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.firstName}</span>
              </h2>
              <p className="text-slate-500 mt-1">Here is your {role.replace('_', ' ')} dashboard for {user?.branch || 'your branch'}.</p>
          </div>
          <div className="flex gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-300">Live Status</span>
              </div>
          </div>
      </div>

      {/* Dynamic KPI Stats based on Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isAsstManager && (
              <>
                  <KPICard title="Operational Efficiency" value="94%" sub="Daily target: 90%" icon={<Activity />} color="emerald" />
                  <KPICard title="Pending Tasks" value="28" sub="Assigned to you" icon={<Clock />} color="amber" />
                  <KPICard title="Staff Availability" value="18/20" sub="2 on leave" icon={<Users />} color="indigo" />
                  <KPICard title="Branch Inflow" value="₹4.2M" sub="Today's volume" icon={<TrendingUp />} color="purple" />
              </>
          )}
          
          {isTeller && (
              <>
                  <KPICard title="My Cash Limit" value="₹5.0L" sub="Current: ₹3.2L" icon={<Wallet />} color="indigo" />
                  <KPICard title="Daily Transactions" value="42" sub="Personal goal: 60" icon={<Activity />} color="emerald" />
                  <KPICard title="Avg Service Time" value="4.5m" sub="Target: <5m" icon={<Clock />} color="amber" />
                  <KPICard title="Customer Rating" value="4.9/5" sub="Excellent performance" icon={<UserCheck />} color="purple" />
              </>
          )}

          {isCashier && (
              <>
                  <KPICard title="Vault Balance" value="₹1.2M" sub="Reconciled at 09:00" icon={<Wallet />} color="emerald" />
                  <KPICard title="High Value Trans" value="18" sub="Above ₹50k threshold" icon={<Banknote />} color="indigo" />
                  <KPICard title="Vault Audit" value="Clean" sub="Last audit: Yesterday" icon={<ShieldCheck />} color="amber" />
                  <KPICard title="Reconciliation" value="Done" sub="Ready for EOD" icon={<CheckCircle />} color="purple" />
              </>
          )}

          {isLoanOfficer && (
              <>
                  <KPICard title="Active Apps" value="42" sub="12 in verification" icon={<FileText />} color="indigo" />
                  <KPICard title="Total Disbursed" value="₹8.4M" sub="This month" icon={<TrendingUp />} color="emerald" />
                  <KPICard title="NPA Risk" value="Low" sub="0.8% portfolio" icon={<ShieldAlert />} color="emerald" />
                  <KPICard title="EMI Collections" value="98%" sub="On time" icon={<Clock />} color="purple" />
              </>
          )}

          {(isRelationShip || isCustomerService) && (
              <>
                  <KPICard title="Client Portfolio" value="540" sub="+12 new this week" icon={<Users />} color="indigo" />
                  <KPICard title="Active Tickets" value="18" sub="5 urgent" icon={<MessageSquare />} color="amber" />
                  <KPICard title="KYC Pending" value="34" sub="Needs follow-up" icon={<UserCheck />} color="red" />
                  <KPICard title="Products Sold" value="86" sub="Insurance, FD, CC" icon={<TrendingUp />} color="emerald" />
              </>
          )}

          {/* Default/Generic set for others if not specialized above */}
          {(!isAsstManager && !isTeller && !isCashier && !isLoanOfficer && !isRelationShip && !isCustomerService) && (
              <>
                  <KPICard title="Branch Customers" value={stats.activeCustomers} sub="Total in branch" icon={<Activity />} color="indigo" />
                  <KPICard title="Branch Revenue" value={stats.branchRevenue} sub="Total inflow" icon={<TrendingUp />} color="emerald" />
                  <KPICard title="Total Deposits" value={stats.totalDeposits} sub="Cumulative balance" icon={<Wallet />} color="indigo" />
                  <KPICard title="Pending Tasks" value={stats.pendingApprovals} sub="Approvals required" icon={<Clock />} color="amber" />
              </>
          )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualization Container */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Performance Analytics</h3>
                      <p className="text-xs text-slate-500 font-medium">Localized data for <span className="text-slate-300">{user?.branch}</span></p>
                  </div>
                  <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-800">
                      <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-indigo-400 bg-indigo-500/10 transition">Role Metric</button>
                      <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-300 transition">Global</button>
                  </div>
              </div>

              <div className="h-72 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.chartData || []}>
                          <defs>
                              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <XAxis 
                              dataKey="name" 
                              stroke="#475569" 
                              fontSize={10} 
                              fontWeight="bold"
                              axisLine={false} 
                              tickLine={false} 
                              dy={10}
                          />
                          <YAxis 
                              stroke="#475569" 
                              fontSize={10} 
                              fontWeight="bold"
                              axisLine={false} 
                              tickLine={false} 
                              dx={-10}
                          />
                          <Tooltip 
                              cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                              contentStyle={{ 
                                  backgroundColor: '#0f172a', 
                                  borderColor: '#1e293b', 
                                  borderRadius: '16px',
                                  fontSize: '11px',
                                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
                              }} 
                              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                          />
                          <Area 
                              type="monotone" 
                              dataKey="applications" 
                              stroke="#6366f1" 
                              strokeWidth={4}
                              fillOpacity={1} 
                              fill="url(#colorPrimary)" 
                              animationDuration={2000}
                          />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Role-Specific Actions / Updates Panels */}
          <div className="space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                         <Clock className="w-5 h-5 text-indigo-500" /> Activity Stream
                      </h3>
                      <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live</span>
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      {stats?.recentActions?.map((action: any, idx: number) => (
                          <div key={idx} className="flex gap-4 p-3.5 rounded-2xl hover:bg-slate-800/60 transition group cursor-pointer border border-transparent hover:border-slate-800/80">
                               <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300">
                                   <CheckCircle className="w-5 h-5 text-slate-500 group-hover:text-white" />
                               </div>
                               <div className="flex-1 min-w-0 flex flex-col justify-center">
                                   <p className="text-sm font-bold text-white truncate leading-tight mb-1">{action.title}</p>
                                   <p className="text-[11px] text-slate-500 truncate font-medium">{action.desc}</p>
                               </div>
                          </div>
                      ))}
                      
                      {!stats?.recentActions && (
                          <div className="py-12 text-center">
                              <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center mx-auto mb-3 border border-slate-800">
                                  <Activity className="w-6 h-6 text-slate-700" />
                              </div>
                              <p className="text-xs text-slate-600 font-medium">No recent activity found</p>
                          </div>
                      )}
                  </div>
                  
                  <button className="w-full mt-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
                       View All Logs <ArrowRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, sub, icon, color }: { title: string, value: string, sub: string, icon: React.ReactElement, color: string }) {
    const config: any = {
        indigo: { text: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'hover:border-indigo-500/50', accent: 'bg-indigo-500' },
        emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'hover:border-emerald-500/50', accent: 'bg-emerald-500' },
        amber: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'hover:border-amber-500/50', accent: 'bg-amber-500' },
        red: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'hover:border-red-500/50', accent: 'bg-red-500' },
        purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'hover:border-purple-500/50', accent: 'bg-purple-500' }
    };

    const style = config[color];

    return (
        <div className={`bg-slate-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 transition-all duration-500 group cursor-pointer ${style.border}`}>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3.5 rounded-2xl transition-all duration-500 ${style.bg} ${style.text} group-hover:scale-110`}>
                    {React.cloneElement(icon, { className: 'w-6 h-6' })}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-600 font-black tracking-widest uppercase">STATISTIC</span>
                    <div className="h-1 w-6 bg-slate-800 rounded-full mt-1 group-hover:w-10 transition-all duration-500"></div>
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-white mb-1.5 group-hover:tracking-tight transition-all duration-500">{value}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 leading-none">{title}</p>
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${style.accent} ${color === 'red' ? 'animate-ping' : ''}`}></div>
                    <p className="text-[10px] font-mono font-bold text-slate-500">{sub}</p>
                </div>
            </div>
        </div>
    );
}
