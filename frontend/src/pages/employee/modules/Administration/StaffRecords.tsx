import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  UserPlus, Search, ShieldCheck, 
  ChevronRight, Briefcase, Loader2,
  X, Mail, Phone, MapPin, Calendar, Building
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffRecords() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    dept: 'Operations',
    role: 'Executive',
    joining: new Date().toISOString().split('T')[0],
    appraisal: 'Good',
    email: '',
    phone: '',
    address: '',
    branch: 'Main Branch'
  });

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://13.201.79.48:8000/api/v1/auth/employee/administration/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://13.201.79.48:8000/api/v1/auth/employee/administration/staff', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Personnel record added successfully');
        setShowAddModal(false);
        fetchStaff();
        setFormData({
            id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: '',
            dept: 'Operations',
            role: 'Executive',
            joining: new Date().toISOString().split('T')[0],
            appraisal: 'Good',
            email: '',
            phone: '',
            address: '',
            branch: 'Main Branch'
        });
      }
    } catch (err) {
      toast.error('Failed to add personnel record');
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <Briefcase className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Personnel Records</h2>
                  <p className="text-slate-500 text-sm mt-1">Comprehensive directory and professional history for branch staff</p>
              </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
             <UserPlus className="w-5 h-5" /> Add New Record
          </button>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-8 overflow-hidden">
           <div className="flex flex-col md:flex-row gap-4 mb-8">
               <div className="flex-1 relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input placeholder="Search Personnel by ID, Name or Department..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium" />
               </div>
           </div>

           <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                            <th className="text-left px-6 py-4">Employee</th>
                            <th className="text-left px-6 py-4">Department</th>
                            <th className="text-left px-6 py-4">Designation</th>
                            <th className="text-center px-6 py-4">Joining Date</th>
                            <th className="text-center px-6 py-4">Appraisal</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                        {staff.map((member) => (
                          <tr 
                            key={member.id} 
                            onClick={() => setSelectedStaff(member)}
                            className="group hover:bg-slate-800/20 transition-all duration-300 cursor-pointer"
                          >
                              <td className="px-6 py-5">
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
                                          {member.name.charAt(0)}{member.name.split(' ')[1]?.charAt(0) || member.name.charAt(1)}
                                      </div>
                                      <div>
                                          <div className="text-sm font-bold text-white leading-none">{member.name}</div>
                                          <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">{member.id}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-5">
                                  <span className="text-xs font-medium text-slate-400">{member.dept}</span>
                              </td>
                              <td className="px-6 py-5 text-indigo-400 font-bold text-[11px] uppercase tracking-widest">
                                  {member.role}
                              </td>
                              <td className="px-6 py-5 text-center font-mono text-[11px] text-slate-500">
                                  {member.joining}
                              </td>
                              <td className="px-6 py-5 text-center">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                      member.appraisal === 'Outstanding' || member.appraisal === 'Excellent' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                      member.appraisal === 'Good' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                  }`}>
                                      {member.appraisal}
                                  </span>
                              </td>
                              <td className="px-6 py-5 text-right">
                                  <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-all">
                                      <ChevronRight className="w-4 h-4" />
                                  </button>
                              </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
           </div>
           
           <div className="mt-10 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
               <div className="flex gap-4 items-center">
                   <ShieldCheck className="w-5 h-5 text-indigo-400" />
                   <p className="text-xs text-indigo-300 font-medium tracking-tight">Staff verification data is linked with the regional HRMS. Next sync in 4 hours.</p>
               </div>
               <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 text-right">HRMS Connect <ChevronRight className="w-3.5 h-3.5" /></button>
           </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && createPortal(
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                    <div>
                        <h3 className="text-xl font-bold text-white">Add Personnel Record</h3>
                        <p className="text-xs text-slate-500 mt-1">Register new employee into the regional branch directory</p>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleAddStaff} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all font-medium" 
                              placeholder="e.g. Rahul Sharma"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Employee ID</label>
                            <input 
                              name="id"
                              value={formData.id}
                              readOnly
                              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-400 font-mono" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                            <select 
                              name="dept"
                              value={formData.dept}
                              onChange={handleInputChange}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none"
                            >
                                <option>Operations</option>
                                <option>IT & Support</option>
                                <option>Risk Management</option>
                                <option>HR & Admin</option>
                                <option>Legal</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Designation</label>
                            <input 
                              name="role"
                              value={formData.role}
                              onChange={handleInputChange}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all font-medium" 
                              placeholder="e.g. Senior Manager"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all font-medium" 
                              placeholder="rahul@sentinelx.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                            <input 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all font-medium" 
                              placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                          type="button"
                          onClick={() => setShowAddModal(false)}
                          className="px-6 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                          type="submit"
                          disabled={saving}
                          className="px-8 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Save Record
                        </button>
                    </div>
                </form>
            </div>
         </div>,
         document.body
      )}

      {/* Staff Detail Modal */}
      {selectedStaff && createPortal(
         <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl relative">
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
                    <button onClick={() => setSelectedStaff(null)} className="absolute top-6 right-6 p-2.5 rounded-2xl bg-white/10 text-white/80 hover:bg-white/20 transition-all backdrop-blur-md">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-10 pb-10 relative">
                    <div className="relative -mt-16 mb-6 flex items-end justify-between">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 p-1.5 shadow-2xl">
                             <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white">
                                 {selectedStaff.name.charAt(0)}{selectedStaff.name.split(' ')[1]?.charAt(0) || selectedStaff.name.charAt(1)}
                             </div>
                        </div>
                        <div className="flex gap-3 pb-2">
                             <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                                 selectedStaff.appraisal === 'Outstanding' || selectedStaff.appraisal === 'Excellent' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                             }`}>
                                 {selectedStaff.appraisal} Performance
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-10">
                        <div className="col-span-2 space-y-8">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tight">{selectedStaff.name}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-indigo-400 font-bold text-sm uppercase tracking-wide">{selectedStaff.role}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span className="text-slate-500 text-xs font-mono">{selectedStaff.id}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-5 rounded-3xl bg-slate-950/50 border border-slate-800/50 space-y-3">
                                    <div className="flex items-center gap-2 text-indigo-400">
                                        <Building className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Department</span>
                                    </div>
                                    <p className="text-sm font-bold text-white">{selectedStaff.dept}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-slate-950/50 border border-slate-800/50 space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Joined On</span>
                                    </div>
                                    <p className="text-sm font-bold text-white">{selectedStaff.joining}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Overview</h4>
                                <div className="p-6 rounded-3xl bg-slate-950/30 border border-slate-800 text-sm text-slate-400 leading-relaxed italic">
                                    "{selectedStaff.name} has been a core member of the {selectedStaff.dept} division since {selectedStaff.joining?.split('-')[0]}. 
                                    Consistently rated as '{selectedStaff.appraisal}', demonstrating exceptional commitment to regional operations and branch growth."
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-[2rem] bg-slate-950/50 border border-slate-800 space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Communication</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500"><Mail className="w-3.5 h-3.5" /></div>
                                            <span className="text-xs font-medium truncate">{selectedStaff.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500"><Phone className="w-3.5 h-3.5" /></div>
                                            <span className="text-xs font-medium">{selectedStaff.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location Info</h4>
                                    <div className="flex items-start gap-3 text-slate-300">
                                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0"><MapPin className="w-3.5 h-3.5" /></div>
                                        <span className="text-xs font-medium leading-relaxed">{selectedStaff.branch || 'Main Branch'} Branch Office</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest">
                                View Full Payroll Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
         </div>,
         document.body
      )}
    </div>
  );
}
