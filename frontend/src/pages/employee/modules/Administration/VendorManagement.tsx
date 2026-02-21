import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, Search, Plus, 
  ExternalLink, Phone, Mail, 
  Star, ShieldCheck, Clock,
  FileText, ArrowUpRight, Loader2, Trash2
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function VendorManagement() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/employee/administration/vendors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setVendors(data.vendors || []);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDeleteVendor = async (name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const vendorId = name.replace(/\s+/g, '_');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/employee/administration/vendors/${vendorId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchVendors();
      }
    } catch (err) {
      console.error('Failed to delete vendor:', err);
    }
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.contact && v.contact.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [vendors, searchQuery]);

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
                  <Truck className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Vendor Ecosystem</h2>
                  <p className="text-slate-500 text-sm mt-1">Directory of external service providers, contractors and procurement partners</p>
              </div>
          </div>
          <button 
            onClick={() => navigate('/employee/vendors/onboard')}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all text-[10px]"
          >
             <Plus className="w-4 h-4" /> Onboard Vendor
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.slice(0, 3).map((v, i) => (
            <div 
              key={i} 
              onClick={() => navigate(`/employee/vendors/${v.name.replace(/\s+/g, '_')}`)}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 group hover:border-indigo-500/50 transition-all duration-500 relative overflow-hidden cursor-pointer"
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-full border border-slate-800">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black text-white">{v.rating}</span>
                    </div>
                </div>
                <div className="space-y-1 mb-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">{v.name}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{v.category}</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                    <div className="flex gap-2">
                        <button className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}><Phone className="w-4 h-4" /></button>
                        <button className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}><Mail className="w-4 h-4" /></button>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/employee/vendors/${v.name.replace(/\s+/g, '_')}`); }}
                      className="text-[10px] font-black uppercase text-indigo-400 flex items-center gap-2 transition-colors hover:text-indigo-300"
                    >
                      Profile <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          ))}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 overflow-hidden">
           <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                   <Clock className="w-4 h-4 text-indigo-500" /> Procurement Pipeline
               </h3>
               <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Vendors..." 
                      className="bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" 
                   />
               </div>
           </div>

            <div className="space-y-4">
                {filteredVendors.map((v, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/employee/vendors/${v.name.replace(/\s+/g, '_')}`)}
                    className="flex items-center gap-6 p-6 bg-slate-950/40 border border-slate-800 rounded-[2rem] hover:bg-slate-900/40 transition-all cursor-pointer group"
                  >
                      <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                              <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{v.name}</div>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                                  v.status === 'Expired' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                  v.status === 'Renewal Pending' || v.status === 'Review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>{v.status}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium font-mono uppercase tracking-tight">Point of Contact: <span className="text-slate-300">{v.contact}</span> • {v.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/employee/vendors/${v.name.replace(/\s+/g, '_')}?tab=contracts`); }}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors"
                          >
                              <FileText className="w-3.5 h-3.5" /> Contracts
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteVendor(v.name); }}
                            className="p-2 text-slate-500 hover:text-rose-500 transition-all active:scale-90"
                          >
                              <Trash2 className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
                ))}
            </div>
            
            <div className="mt-10 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                <p className="text-xs text-emerald-500/80 font-medium font-mono uppercase tracking-tight">Compliance verification is required for all new vendors with annual contracts exceeding ₹5.00 Lakhs.</p>
                <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-400 transition-colors">Compliance Portal <ExternalLink className="w-4 h-4" /></button>
            </div>
       </div>
    </div>
  );
}
