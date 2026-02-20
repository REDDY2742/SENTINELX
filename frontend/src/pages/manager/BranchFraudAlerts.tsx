import { useState } from 'react';
import { AlertOctagon, MapPin, Smartphone, Activity, CheckCircle, XCircle } from 'lucide-react';

const mockBranchAlerts = [
  { id: 'AL-9921', user: 'Emily Clark', type: 'Velocity Limit', amount: 1500.00, risk: 'High', status: 'Pending', time: '10 mins ago', ip: '192.168.1.5' },
  { id: 'AL-9922', user: 'David Miller', type: 'Geo Mismatch', amount: 450.00, risk: 'Medium', status: 'Investigating', time: '1 hour ago', ip: '10.0.0.2' },
];

export default function BranchFraudAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
         <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
               <AlertOctagon className="w-6 h-6 text-red-500 animate-pulse" /> Branch Fraud Alerts
            </h1>
            <p className="text-slate-400 text-sm mt-1">Review suspicious activity flagged in your branch.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {mockBranchAlerts.map(alert => (
            <div 
               key={alert.id}
               onClick={() => setSelectedAlert(alert)}
               className={`bg-slate-900 border ${selectedAlert?.id === alert.id ? 'border-red-500 shadow-lg shadow-red-500/10' : 'border-slate-800 hover:border-slate-600'} rounded-xl p-6 cursor-pointer transition relative group overflow-hidden`}
            >
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                   alert.risk === 'High' ? 'bg-red-500' : 'bg-yellow-500'
               }`} />
               
               <div className="flex justify-between items-start mb-4 pl-3">
                  <div>
                     <h3 className="font-bold text-white text-lg">{alert.user}</h3>
                     <p className="text-sm text-red-400 font-bold">{alert.type}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${
                      alert.risk === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                      {alert.risk} Risk
                  </span>
               </div>
               
               <div className="flex justify-between items-center mb-4 pl-3">
                  <div className="text-slate-500 text-sm flex items-center gap-1">
                     <Clock className="w-3 h-3" /> {alert.time}
                  </div>
                  <div className="text-white font-mono font-bold">${alert.amount.toLocaleString()}</div>
               </div>

               {selectedAlert?.id === alert.id && (
                  <div className="mt-4 pt-4 border-t border-slate-800 pl-3 animate-in slide-in-from-top-2 duration-200">
                     <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
                        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> NY, USA</div>
                        <div className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> iPhone 14</div>
                        <div className="flex items-center gap-1 col-span-2 font-mono"><Activity className="w-3 h-3" /> IP: {alert.ip}</div>
                     </div>
                     <div className="flex gap-2">
                        <button className="flex-1 bg-red-600/90 hover:bg-red-600 text-white py-2 rounded text-xs font-bold transition flex items-center justify-center gap-1">
                           <XCircle className="w-3 h-3" /> Escalate
                        </button>
                        <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1">
                           <CheckCircle className="w-3 h-3" /> Clear
                        </button>
                     </div>
                  </div>
               )}
            </div>
         ))}
      </div>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    )
}
