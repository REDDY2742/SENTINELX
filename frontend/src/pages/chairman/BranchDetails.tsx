import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Building, Users, TrendingUp, AlertTriangle, Activity, Loader2, Mail, BadgeCheck, Plus, Search, Check, X } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
}

interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  staffCount: number;
  status: string;
  revenue?: string;
  maintenanceCost?: string;
  performanceScore?: string;
  employees: Employee[];
}

export default function BranchDetails() {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  useEffect(() => {
    // ... (fetch logic remains same)
    const fetchBranchDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/admin/branches', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const foundBranch = data.branches.find((b: Branch) => b.id === branchId);
        setBranch(foundBranch || null);
      } catch (err) {
        console.error('Failed to fetch branch details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (branchId) {
      fetchBranchDetails();
    }
  }, [branchId]);

  if (loading) {
// ...
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!branch) {
// ...
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
        <h2 className="text-2xl font-bold">Branch Not Found</h2>
        <button onClick={() => navigate('/chairman/branches')} className="text-indigo-400 hover:underline">
          Return to Branch List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white space-y-8 p-6">
      {/* Header */}
      <div>
        <button 
            onClick={() => navigate('/chairman/branches')} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 group"
        >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Branches
        </button>
        
        <div className="flex justify-between items-start">
            <div className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-2xl shadow-indigo-900/20">
                    <Building className="w-10 h-10 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-white mb-2">{branch.name}</h1>
                    <div className="flex items-center gap-4 text-slate-400 font-medium">
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                            <MapPin className="w-4 h-4 text-indigo-400" /> {branch.location}
                        </span>
                        <span className="font-mono text-sm opacity-60">ID: {branch.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                            branch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                            {branch.status}
                        </span>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-lg shadow-indigo-900/20"
            >
                Edit Branch Details
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
              <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-slate-700 transition">
                  <TrendingUp className="w-16 h-16 opacity-20" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-4xl font-light text-white mb-2">{branch.revenue || '₹0.0Cr'}</h3>
              <p className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> +12% vs last month
              </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
              <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-slate-700 transition">
                  <Activity className="w-16 h-16 opacity-20" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Maintenance Cost</p>
              <h3 className="text-4xl font-light text-white mb-2">{branch.maintenanceCost || '₹0.0L'}</h3>
              <p className="text-amber-400 text-sm font-medium flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Within Budget
              </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
              <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-slate-700 transition">
                  <Users className="w-16 h-16 opacity-20" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Performance Score</p>
              <h3 className="text-4xl font-light text-white mb-2">{branch.performanceScore || '0/100'}</h3>
              <p className="text-indigo-400 text-sm font-medium flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" /> Excellent
              </p>
          </div>
      </div>

      {/* Staff Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                  <h3 className="text-xl font-bold text-white">Employee Roster</h3>
                  <p className="text-slate-500 text-sm mt-1">Manage staff access and roles for this branch</p>
              </div>
              <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 mr-2">
                       <Users className="w-4 h-4 text-indigo-400" />
                       <span className="text-slate-300 text-sm">Total: <strong className="text-white">{branch.employees.length}</strong></span>
                  </div>
                  <button 
                    onClick={() => setIsAddEmployeeOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                  >
                      <Plus className="w-4 h-4" /> Add Employee
                  </button>
              </div>
          </div>
          
          <div className="divide-y divide-slate-800">
              {branch.employees.length > 0 ? (
                  branch.employees.map((emp) => (
                      <div key={emp.id} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition">
                          <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${
                                  emp.role === 'manager' 
                                  ? 'bg-indigo-600 text-white shadow-indigo-500/20' 
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                  {emp.name.charAt(0)}
                              </div>
                              <div>
                                  <h4 className="text-white font-medium text-lg">{emp.name}</h4>
                                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                      <span className="flex items-center gap-1.5">
                                          <Mail className="w-3.5 h-3.5" /> {emp.email}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded textxs font-mono uppercase tracking-wider ${
                                          emp.role === 'manager' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 bg-slate-800'
                                      }`}>
                                          {emp.role}
                                      </span>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                  emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                  {emp.status}
                              </span>
                              <button className="text-slate-500 hover:text-white transition px-3 py-1.5 rounded hover:bg-slate-800">
                                  Manage Access
                              </button>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="p-12 text-center">
                      <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <h3 className="text-white font-medium">No Employees Assigned</h3>
                      <p className="text-slate-500 text-sm mt-1">Add users with this Branch ID via User Management to populate this list.</p>
                  </div>
              )}
          </div>
      </div>
      
      {/* Add Employee Modal */}
      {isAddEmployeeOpen && (
          <AddEmployeeModal 
              branchId={branch.id} 
              onClose={() => setIsAddEmployeeOpen(false)} 
              onAdd={() => {
                  setIsAddEmployeeOpen(false);
                  // Trigger re-fetch logic (simplest way is to force reload or callback, 
                  // but for now we'll just reload the page or we should extract fetch into a function 
                  // that can be passed down. For this iteration, I'll rely on reloading or moving fetch out)
                  window.location.reload(); 
              }} 
          />
      )}
      {/* Edit Modal */}
      {isEditing && branch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Edit Branch Framework</h2>
                    <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                 </div>
                 
                 <form onSubmit={async (e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const updates = {
                         id: branch.id,
                         name: formData.get('name') as string,
                         location: formData.get('location') as string,
                         status: formData.get('status') as string,
                         revenue: formData.get('revenue') as string,
                         maintenanceCost: formData.get('maintenanceCost') as string,
                         performanceScore: formData.get('performanceScore') as string,
                     };

                     try {
                        const token = localStorage.getItem('access_token');
                        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/admin/branches', {
                            method: 'POST',
                            headers: { 
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updates)
                        });

                        if (response.ok) {
                            setBranch({ ...branch, ...updates });
                            setIsEditing(false);
                        }
                     } catch (err) {
                        console.error("Failed to update branch:", err);
                     }
                 }} className="space-y-5">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Branch Name</label>
                            <input name="name" type="text" defaultValue={branch.name} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                            <input name="location" type="text" defaultValue={branch.location} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition" />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Revenue</label>
                            <input name="revenue" type="text" defaultValue={branch.revenue} placeholder="e.g. ₹1.2Cr" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Maint. Cost</label>
                            <input name="maintenanceCost" type="text" defaultValue={branch.maintenanceCost} placeholder="e.g. ₹4.5L" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition" />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Perf. Score</label>
                            <input name="performanceScore" type="text" defaultValue={branch.performanceScore} placeholder="e.g. 94/100" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Branch Status</label>
                            <select name="status" defaultValue={branch.status} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition appearance-none">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                     </div>

                     <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                         <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-slate-400 hover:text-white transition">Cancel</button>
                         <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-900/30 transition">Save Framework</button>
                     </div>
                 </form>
            </div>
        </div>
      )}
    </div>
  );
}

function AddEmployeeModal({ branchId, onClose, onAdd }: { branchId: string, onClose: () => void, onAdd: () => void }) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('access_token');
                // Correct endpoint is /api/v1/auth/users
                const response = await fetch('https://13.201.79.48:8000/api/v1/auth/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                
                // Filter users: must be a staff role (not chairman/customer), and NOT in this branch already
                const eligible = (data.users || []).filter((u: any) => 
                    u.role !== 'chairman' && 
                    u.role !== 'customer' &&
                    u.branchId !== branchId
                );
                
                setUsers(eligible);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [branchId]);

    const handleAdd = async () => {
        if (!selectedUserId) return;
        setUpdating(true);
        try {
            const token = localStorage.getItem('access_token');
            // Update user to assign branchId
            await fetch(`https://13.201.79.48:8000/api/v1/auth/users/${selectedUserId}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ branchId: branchId })
            });
            onAdd();
        } catch (err) {
            console.error("Failed to add employee", err);
            setUpdating(false);
        }
    };

    const filteredUsers = users.filter(u => 
        (u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
         u.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
             <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                 <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                     <div>
                         <h2 className="text-xl font-bold text-white">Add Employee to Branch</h2>
                         <p className="text-slate-500 text-sm mt-1">Select an employee from the pool to assign here.</p>
                     </div>
                     <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                 </div>
                 
                 <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search by name or ID..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                     {loading ? (
                         <div className="flex justify-center py-8"><Loader2 className="animate-spin text-indigo-500 w-6 h-6" /></div>
                     ) : filteredUsers.length > 0 ? (
                         filteredUsers.map(user => {
                             const isSelected = selectedUserId === user.id;
                             return (
                                 <div 
                                    key={user.id} 
                                    onClick={() => setSelectedUserId(user.id)}
                                    className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition border ${
                                        isSelected 
                                        ? 'bg-indigo-600/10 border-indigo-600/50' 
                                        : 'bg-transparent border-transparent hover:bg-slate-800'
                                    }`}
                                 >
                                     <div className="flex items-center gap-3">
                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                             isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                                         }`}>
                                             {user.firstName ? user.firstName.charAt(0) : user.username.charAt(0)}
                                         </div>
                                         <div>
                                             <div className={`font-medium ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                                                 {user.firstName} {user.lastName} <span className="text-slate-500 text-xs">({user.username})</span>
                                             </div>
                                             <div className="text-xs text-slate-500 flex gap-2">
                                                 <span>{user.employeeId || 'No ID'}</span>
                                                 <span>•</span>
                                                 <span className="capitalize">{user.role}</span>
                                                 <span>•</span>
                                                 <span>{user.branchId || 'Unassigned'}</span>
                                             </div>
                                         </div>
                                     </div>
                                     {isSelected && <Check className="w-5 h-5 text-indigo-400" />}
                                 </div>
                             );
                         })
                     ) : (
                         <div className="py-8 text-center text-slate-500 text-sm">No eligible employees found.</div>
                     )}
                 </div>

                 <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
                     <button onClick={onClose} disabled={updating} className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50">Cancel</button>
                     <button 
                        onClick={handleAdd} 
                        disabled={!selectedUserId || updating}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                        {updating ? 'Adding...' : 'Add Selected Employee'}
                     </button>
                 </div>
             </div>
        </div>
    );
}

