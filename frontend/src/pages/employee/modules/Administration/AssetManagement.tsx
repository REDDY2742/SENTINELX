import { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, 
  Settings, Monitor, Printer, 
  Trash2, Edit, CheckCircle2,
  AlertTriangle, History, Loader2
} from 'lucide-react';

export default function AssetManagement() {
  const [assets, setAssets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/administration/assets', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setAssets(data.assets || []);
        
        // Map backend categories to include icons
        const iconMap: any = {
           'IT Hardware': Monitor,
           'Printers': Printer,
           'Networking': Settings,
           'Cash Tech': Package
        };
        
        const cats = (data.categories || []).map((c: any) => ({
           ...c,
           icon: iconMap[c.name] || Package
        }));
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch assets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Operational': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Repair': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Retired': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-800';
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <Package className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Asset Inventory</h2>
                  <p className="text-slate-500 text-sm mt-1">Track branch infrastructure, equipment lifecycle and maintenance</p>
              </div>
          </div>
          <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
             <Plus className="w-5 h-5" /> Register Asset
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-6 flex items-center gap-5 group hover:border-indigo-500/30 transition-all">
                <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 group-hover:text-indigo-400 transition-colors">
                    <c.icon className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{c.name}</div>
                    <div className="text-xl font-bold text-white">{c.count} Items</div>
                </div>
            </div>
          ))}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
           <div className="flex flex-col md:flex-row gap-4 mb-8">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input placeholder="Search Serial No, Name or Category..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all px-4" />
               </div>
               <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-800 rounded-2xl px-4 text-slate-400 cursor-pointer hover:bg-slate-900 transition-all">
                   <Settings className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
               </div>
           </div>

           <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/50">
                            <th className="text-left py-4 px-2">Asset Details</th>
                            <th className="text-left py-4 px-2">Category</th>
                            <th className="text-left py-4 px-2">Current Status</th>
                            <th className="text-left py-4 px-2">Assignee</th>
                            <th className="text-right py-4 px-2">Valuation</th>
                            <th className="py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                        {assets.map((item) => (
                          <tr key={item.id} className="group hover:bg-slate-800/20 transition-all duration-300">
                              <td className="py-6 px-2">
                                  <div className="text-sm font-bold text-white mb-0.5">{item.name}</div>
                                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{item.id}</div>
                              </td>
                              <td className="py-6 px-2">
                                  <span className="text-[11px] font-medium text-slate-400">{item.category}</span>
                              </td>
                              <td className="py-6 px-2">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                                      {item.status}
                                  </span>
                              </td>
                              <td className="py-6 px-2">
                                  <div className="flex items-center gap-2 text-slate-400">
                                      <div className="w-2 h-2 rounded-full bg-indigo-500/40"></div>
                                      <span className="text-xs font-bold">{item.assignee}</span>
                                  </div>
                              </td>
                              <td className="py-6 px-2 text-right">
                                  <div className="text-sm font-black text-indigo-400">{item.value}</div>
                              </td>
                              <td className="py-6 px-2 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-2 text-slate-500 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                                      <button className="p-2 text-slate-500 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                              </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
           </div>

           <div className="mt-8 flex justify-between items-center text-slate-500">
               <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 84 Items Audited
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                       <AlertTriangle className="w-4 h-4 text-amber-500" /> 2 Discrepancies
                   </div>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-indigo-400 transition-colors">
                   View Maintenance Logs <History className="w-4 h-4" />
               </button>
           </div>
      </div>
    </div>
  );
}
