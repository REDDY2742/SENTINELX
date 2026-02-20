import { useState, useEffect, useMemo } from 'react';
import { 
  Users, UserPlus, Search, Filter, Mail, Phone, 
  Star, ChevronRight, Loader2, X, Shield, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffDirectory() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Teller',
    dept: 'Customer Service',
    email: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/branch-management/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.staff) {
        setStaff(data.staff);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      toast.error('Failed to sync staff directory');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      const newMember = { 
        ...formData, 
        id: `EMP-${Math.floor(Math.random() * 9000 + 1000)}`,
        performance: 5.0
      };
      
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/branch-management/staff', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMember)
      });
      
      if (response.ok) {
        toast.success('Personnel onboarded successfully');
        setShowAddModal(false);
        fetchStaff();
      }
    } catch (err) {
      toast.error('Failed to onboard personnel');
    } finally {
      setSaving(false);
    }
  };

  const filteredStaff = useMemo(() => {
    return (staff || []).filter(member => {
      const name = member?.name || member?.username || '';
      const id = member?.id || member?.employeeId || '';
      const role = member?.role || '';
      const dept = member?.dept || member?.department || '';

      const query = searchQuery.toLowerCase();
      const matchesSearch = name.toLowerCase().includes(query) || 
                          id.toLowerCase().includes(query) ||
                          role.toLowerCase().includes(query);
      
      const matchesDept = selectedDept === 'All Departments' || 
                         dept === selectedDept || 
                         (member?.department === selectedDept);
      
      return matchesSearch && matchesDept;
    });
  }, [staff, searchQuery, selectedDept]);

  const getStatusColor = (status: string) => {
    if (!status) return 'emerald';
    switch (status.toLowerCase()) {
      case 'active': return 'emerald';
      case 'available': return 'sky';
      case 'busy': return 'rose';
      case 'on_leave': return 'slate';
      default: return 'indigo';
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
          <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Staff Workspace</h2>
              <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                 <Users className="w-4 h-4 text-indigo-500" /> Manage personnel, shifts, and departmental performance
              </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
             <UserPlus className="w-5 h-5" /> Onboard Staff
          </button>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8">
           <div className="flex flex-col md:flex-row gap-4 mb-10">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search staff members by name, ID or role..." 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-indigo-500 transition-all text-white font-medium outline-none" 
                   />
               </div>
               <div className="flex items-center gap-3 bg-slate-950/50 border border-slate-800 rounded-2xl p-2 px-4 shadow-inner">
                   <Filter className="w-4 h-4 text-slate-500" />
                   <select 
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    className="bg-transparent border-none text-xs font-bold text-white focus:ring-0 outline-none cursor-pointer"
                   >
                       <option className="bg-slate-900">All Departments</option>
                       <option className="bg-slate-900">Cash & Vault</option>
                       <option className="bg-slate-900">Credit & Loans</option>
                       <option className="bg-slate-900">Customer Service</option>
                   </select>
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredStaff.map((member) => {
                   const color = getStatusColor(member.status);
                   return (
                     <div key={member.id} className="bg-slate-900/60 border border-slate-800 rounded-[2rem] p-6 group hover:border-indigo-500/50 transition-all duration-500 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            <Users className="w-20 h-20" />
                        </div>
                        
                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-black text-white shadow-lg">
                                {(member?.name || member?.username || 'U').charAt(0).toUpperCase()}
                                {(member?.name || member?.username || '').split(' ')[1]?.charAt(0).toUpperCase() || ''}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${color}-500/10 text-${color}-500 border border-${color}-500/20`}>
                                {(member?.status || 'Active').replace('_', ' ')}
                            </div>
                        </div>

                        <div className="space-y-1 mb-6 relative z-10">
                             <h3 className="text-lg font-bold text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                                {member?.name || member?.username || 'Unknown Employee'}
                             </h3>
                             <p className="text-xs text-indigo-400 font-medium">
                                {member?.role || 'Staff Member'} • {member?.dept || member?.department || 'Operations'}
                             </p>
                             <div className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
                                {member?.id || member?.employeeId || 'N/A'}
                             </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-800/50 relative z-10">
                             <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-medium truncate">{member?.email || 'N/A'}</span>
                             </div>
                             <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                                <Phone className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-medium">{member?.phone || 'N/A'}</span>
                             </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="text-xs font-black text-white">{member.performance}</span>
                            </div>
                            <button className="p-2 text-slate-500 hover:text-indigo-400 transition-all bg-slate-950 border border-slate-800 rounded-xl">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                     </div>
                   );
               })}
           </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Personnel Onboarding</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all"><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            <form onSubmit={handleOnboard} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Suhasini Reddy" className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none">
                    <option>Head Cashier</option>
                    <option>Loan Officer</option>
                    <option>Relationship Manager</option>
                    <option>Teller</option>
                    <option>Customer Service</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                  <select value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none">
                    <option>Cash & Vault</option>
                    <option>Credit & Loans</option>
                    <option>Customer Service</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="alex@sentinelx.com" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98XXX XXX21" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" />
                </div>
              </div>
              <button disabled={saving} type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Briefcase className="w-4 h-4" /> Finalize Onboarding</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
