
import { useState, useEffect } from 'react';
import { MapPin, Users, Plus, Building, Search, Loader2 } from 'lucide-react';

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
  employees: Employee[];
}

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [totalStaff, setTotalStaff] = useState(0);

  useEffect(() => {
    fetchBranches();
  }, []);

  const INDIAN_STATES = [
    "Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", 
    "Delhi", "Gujarat", "West Bengal", "Uttar Pradesh", "Kerala", "Rajasthan", "Madhya Pradesh"
  ];

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/admin/branches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBranches(data.branches || []);
      setTotalStaff(data.totalStaff || 0);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (branch.manager || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesState = selectedState === 'All' || branch.location.includes(selectedState);
    const matchesCategory = selectedCategory === 'All' || (branch as any).category === selectedCategory;
    
    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-light tracking-wide text-white">Branch Management</h1>
           <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Network & Staffing Overview</p>
        </div>
      <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
           <Plus className="w-4 h-4" /> Add New Branch
        </button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 flex flex-wrap gap-4">
             <div className="relative flex-1 min-w-[300px]">
               <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
               <input 
                 type="text" 
                 placeholder="Search branches, managers, or locations..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 transition"
               />
             </div>
             
             <div className="w-48">
               <select
                 value={selectedState}
                 onChange={(e) => setSelectedState(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 transition appearance-none cursor-pointer"
                 style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '.65em auto' }}
               >
                 <option value="All">All States</option>
                 {INDIAN_STATES.map(state => (
                   <option key={state} value={state}>{state}</option>
                 ))}
               </select>
             </div>

             <div className="w-48">
               <select
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 transition appearance-none cursor-pointer"
                 style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '.65em auto' }}
               >
                 <option value="All">All Categories</option>
                 <option value="Metropolitan">Metropolitan</option>
                 <option value="Urban">Urban</option>
                 <option value="Rural">Rural</option>
               </select>
             </div>
          </div>
          <div className="flex gap-4">
              <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-slate-400 font-mono text-xs whitespace-nowrap">
                 Branches: <span className="text-white font-bold ml-1">{branches.length}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-slate-400 font-mono text-xs whitespace-nowrap">
                 Total Staff: <span className="text-indigo-400 font-bold ml-1">{totalStaff.toLocaleString()}</span>
              </div>
          </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
           <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
           {filteredBranches.map(branch => (
              <BranchRow key={branch.id} branch={branch} />
           ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
           <AddBranchForm onClose={() => setIsModalOpen(false)} onAdd={(newBranch) => {
               setBranches([...branches, newBranch]);
               setIsModalOpen(false);
           }} />
        </div>
      )}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/api';

function BranchRow({ branch }: { branch: Branch }) {
   const navigate = useNavigate();

   return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition">
          <div className="flex items-center gap-4 w-1/4">
             <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Building className="w-5 h-5 text-indigo-400" />
             </div>
             <div>
                <h3 className="font-bold text-white">{branch.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {branch.location}
                    </div>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border ${
                        (branch as any).category === 'Metropolitan' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                        (branch as any).category === 'Rural' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>{(branch as any).category || 'Urban'}</span>
                </div>
             </div>
          </div>

          <div className="flex-1 grid grid-cols-4 gap-4 items-center">
              <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Manager</div>
                  <div className="text-sm text-slate-300 font-medium">{branch.manager}</div>
              </div>
              <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Staff</div>
                  <div className="text-sm text-slate-300 font-medium flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-400" /> {branch.staffCount}
                  </div>
              </div>
              <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</div>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      branch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>{branch.status}</span>
              </div>
              <div className="text-right">
                  <button 
                    onClick={() => navigate(branch.id)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded hover:bg-indigo-500/10 transition"
                  >
                      View Details
                  </button>
              </div>
          </div>
      </div>
   )
}

function AddBranchForm({ onClose, onAdd }: { onClose: () => void, onAdd: (b: Branch) => void }) {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            id,
            name,
            location,
            manager: 'Vacant',
            staffCount: 0,
            status: 'Active',
            employees: []
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">Add New Branch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Branch Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Downtown Hub" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Branch ID</label>
                    <input type="text" required value={id} onChange={e => setId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. BR-9000" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                    <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. New York, NY" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 font-medium">Create Branch</button>
                </div>
            </form>
        </div>
    )
}
