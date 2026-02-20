import { useState, useEffect } from 'react';
import { AlertOctagon, MapPin, Smartphone, User, DollarSign, XCircle, CheckCircle, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FraudMonitoring() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [chartDataState, setChartDataState] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://13.201.79.48:8000/api/v1/auth/admin/fraud-alerts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setAlerts(data.alerts || []);
        setChartDataState(data.chart_data || []);
      } catch (err) {
        console.error('Failed to fetch fraud alerts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Feed */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                     <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" /> Live Fraud Feed
                  </h2>
                  <div className="flex gap-2">
                     <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Real-time
                     </span>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {alerts.length > 0 ? alerts.map((alert) => (
                     <div 
                        key={alert.id}
                        onClick={() => setSelectedAlert(alert)}
                        className={`bg-slate-950 border ${selectedAlert?.id === alert.id ? 'border-red-500 shadow-lg shadow-red-500/10' : 'border-slate-800 hover:border-slate-600'} rounded-xl p-4 cursor-pointer transition flex justify-between items-center group relative overflow-hidden`}
                     >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                           alert.risk === 'Critical' ? 'bg-red-600' : 
                           alert.risk === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`} />
                        
                        <div className="flex items-center gap-4 pl-3">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${
                              alert.risk === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                              alert.risk === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                              'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                           }`}>
                              {alert.score}
                           </div>
                           <div>
                              <h3 className="text-white font-bold">{alert.type}</h3>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                 <span className="flex items-center gap-1"><User className="w-3 h-3" /> {alert.user}</span>
                                 <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.location}</span>
                              </div>
                           </div>
                        </div>

                        <div className="text-right">
                           <div className="text-white font-mono font-bold">₹{alert.amount.toLocaleString('en-IN')}</div>
                           <div className="text-xs text-slate-400">{alert.time}</div>
                        </div>
                     </div>
                  )) : (
                     <div className="p-8 text-center text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800">
                        No suspicious activity detected.
                     </div>
                  )}
               </div>
            </div>

            {/* Trends Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
               <h3 className="font-bold text-white mb-4">Weekly Fraud Attempts</h3>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataState}>
                     <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="name" stroke="#64748b" />
                     <YAxis stroke="#64748b" />
                     <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                     <Area type="monotone" dataKey="count" stroke="#ef4444" fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Investigation Panel */}
         <div className="lg:col-span-1">
            {selectedAlert ? (
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24 shadow-2xl h-fit">
                  <div className="flex justify-between items-start mb-6">
                     <h2 className="text-xl font-bold text-white">Investigation Details</h2>
                     <span className="font-mono text-xs text-slate-500">{selectedAlert.id}</span>
                  </div>

                  <div className="space-y-6">
                     <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center gap-4">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border-4 border-red-500/20">
                           <span className="text-2xl font-bold text-red-500">{selectedAlert.score}</span>
                        </div>
                        <div>
                           <div className="text-slate-400 text-xs uppercase font-bold">Fraud Probability</div>
                           <div className="text-red-400 font-bold">{selectedAlert.score >= 90 ? 'Critical' : 'High'} Risk</div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <DetailRow label="Device IP" value={selectedAlert.ip} icon={<Smartphone className="w-4 h-4" />} />
                        <DetailRow label="Location" value={selectedAlert.location} icon={<MapPin className="w-4 h-4" />} />
                        <DetailRow label="Transaction Amount" value={`₹${Number(selectedAlert.amount).toLocaleString('en-IN')}`} icon={<DollarSign className="w-4 h-4" />} />
                     </div>

                     <div className="pt-6 border-t border-slate-800 space-y-3">
                        <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-red-500/20">
                           <XCircle className="w-4 h-4" /> Freeze Account
                        </button>
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition border border-slate-700">
                           <CheckCircle className="w-4 h-4" /> Mark as False Positive
                        </button>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
                  <AlertOctagon className="w-16 h-16 mb-4 opacity-20" />
                  <p>Select an alert to investigate.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
   return (
      <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800/50">
         <div className="flex items-center gap-3 text-slate-400">
            {icon}
            <span className="text-sm font-medium">{label}</span>
         </div>
         <span className="text-white font-mono text-sm">{value}</span>
      </div>
   )
}
