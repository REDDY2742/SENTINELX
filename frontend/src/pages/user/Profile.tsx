import { useState, useEffect } from 'react';
import { 
  User, Shield, Lock, Mail, 
  Camera, Landmark, CreditCard, CheckCircle, AlertCircle,
  Settings as SettingsIcon, LogOut, ChevronRight, Globe, Edit3, Save, X, Loader2, MapPin
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { API_BASE_URL } from '@/lib/api';

interface UserData {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  branch?: string;
  branchId?: string;
  accountType?: string;
  accountNumber?: string;
  accountStatus?: string;
  balance: string | number;
  language?: string;
  currency?: string;
}

export default function Profile() {
  const { user, refreshUser } = useOutletContext<{ user: UserData, refreshUser: () => Promise<void> }>();
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [branchDetails, setBranchDetails] = useState<any>(null);
  const [loadingBranch, setLoadingBranch] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Edit States
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        language: user.language || 'English (US)',
        currency: user.currency || 'INR - Indian Rupee (₹)'
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.branchId) {
      const fetchBranch = async () => {
        setLoadingBranch(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/public/branches`);
          const data = await response.json();
          const myBranch = data.branches?.find((b: any) => b.id === user.branchId);
          if (myBranch) setBranchDetails(myBranch);
        } catch (err) {
          console.error('Failed to fetch branch details');
        } finally {
          setLoadingBranch(false);
        }
      };
      fetchBranch();
    }
  }, [user?.branchId]);

  const fullName = `${user?.firstName} ${user?.lastName}`;
  const initial = user?.firstName?.[0] || 'U';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) throw new Error('Update failed');
      
      await refreshUser();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      // We might need to refresh the layout context here, 
      // but usually the next navigation or refresh will handle it.
      // For now, let's just show success.
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-5xl font-bold text-white border-4 border-slate-800 shadow-2xl">
              {initial}
            </div>
            <button className="absolute bottom-0 right-0 p-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full border-4 border-slate-900 shadow-xl transition-transform hover:scale-110">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-4xl font-black text-white">{fullName}</h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Account
              </span>
            </div>
            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-indigo-400" /> {user?.email}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
               <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Account #:</span>
                  <span className="text-sm text-white font-mono">{user?.accountNumber || 'SB-100203040'}</span>
               </div>
               <div className="bg-slate-950/50 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Branch:</span>
                  <span className="text-sm text-white">{user?.branch || 'Main Square'}</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
             {!isEditing ? (
               <button 
                 onClick={() => setIsEditing(true)}
                 className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
               >
                  <Edit3 className="w-4 h-4" /> Edit Profile
               </button>
             ) : (
               <div className="flex gap-2">
                 <button 
                   onClick={handleSave}
                   disabled={saving}
                   className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-2xl font-bold transition-all flex items-center gap-2"
                 >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                 </button>
                 <button 
                   onClick={() => setIsEditing(false)}
                   className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-2xl font-bold border border-slate-700 transition-all flex items-center gap-2"
                 >
                    <X className="w-4 h-4" /> Cancel
                 </button>
               </div>
             )}
             <button onClick={handleLogout} className="bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 px-6 py-3 rounded-2xl font-bold border border-slate-700 hover:border-red-500/30 transition-all flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
             </button>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
         {[
           { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
           { id: 'address', label: 'Address & Branch', icon: <MapPin className="w-4 h-4" /> },
           { id: 'security', label: 'Security & Privacy', icon: <Shield className="w-4 h-4" /> },
           { id: 'settings', label: 'App Settings', icon: <SettingsIcon className="w-4 h-4" /> }
         ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
         ))}
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            {activeTab === 'personal' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" /> Basic Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField 
                    label="First Name" 
                    value={editData.firstName} 
                    isEditing={isEditing} 
                    onChange={(v: string) => setEditData({...editData, firstName: v})}
                  />
                  <EditableField 
                    label="Last Name" 
                    value={editData.lastName} 
                    isEditing={isEditing} 
                    onChange={(v: string) => setEditData({...editData, lastName: v})}
                  />
                  <EditableField 
                    label="User Name" 
                    value={user?.username} 
                    isEditing={false} // Username can't be changed
                  />
                  <EditableField 
                    label="Email" 
                    value={user?.email} 
                    isEditing={false} // Email restricted for now
                  />
                  <EditableField 
                    label="Phone" 
                    value={editData.phone} 
                    isEditing={isEditing} 
                    onChange={(v: string) => setEditData({...editData, phone: v})}
                  />
                  <EditableField 
                    label="Date of Birth" 
                    value={editData.dateOfBirth} 
                    isEditing={isEditing} 
                    type="date"
                    onChange={(v: string) => setEditData({...editData, dateOfBirth: v})}
                  />
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-indigo-400" /> Residential Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <EditableField 
                      label="Street Address" 
                      value={editData.address} 
                      className="md:col-span-2" 
                      isEditing={isEditing}
                      onChange={(v: string) => setEditData({...editData, address: v})}
                    />
                    <EditableField 
                      label="City" 
                      value={editData.city} 
                      isEditing={isEditing}
                      onChange={(v: string) => setEditData({...editData, city: v})}
                    />
                    <EditableField 
                      label="State" 
                      value={editData.state} 
                      isEditing={isEditing}
                      onChange={(v: string) => setEditData({...editData, state: v})}
                    />
                    <EditableField 
                      label="Pincode" 
                      value={editData.pincode} 
                      isEditing={isEditing}
                      onChange={(v: string) => setEditData({...editData, pincode: v})}
                    />
                    <EditableField label="Country" value="India" isEditing={false} />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <Landmark className="w-5 h-5 text-indigo-400" /> Branch Information
                  </h3>
                  {loadingBranch ? (
                    <div className="animate-pulse flex space-x-4 h-32 bg-slate-950 rounded-2xl" />
                  ) : branchDetails ? (
                    <div className="bg-gradient-to-br from-indigo-900/20 to-slate-950 p-6 rounded-2xl border border-indigo-500/20 shadow-inner">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-black text-white mb-1">{branchDetails.name}</h4>
                          <p className="text-indigo-400 text-sm font-bold tracking-widest uppercase">{branchDetails.id}</p>
                        </div>
                        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">Operational</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                         <div className="flex items-center gap-3 text-slate-400">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            <span>{branchDetails.location}</span>
                         </div>
                         <div className="flex items-center gap-3 text-slate-400">
                            <User className="w-4 h-4 text-indigo-500" />
                            <span>Manager: {branchDetails.manager || 'Vacant'}</span>
                         </div>
                         <div className="flex items-center gap-3 text-slate-400">
                            <Shield className="w-4 h-4 text-indigo-500" />
                            <span>Swift Code: STNL-{user?.branchId?.slice(-4)}IN</span>
                         </div>
                         <div className="flex items-center gap-3 text-emerald-400">
                            <Globe className="w-4 h-4" />
                            <span className="font-bold">24/7 Digital Support Available</span>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-8 rounded-2xl border border-dashed border-slate-800 text-center">
                       <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                       <p className="text-slate-500">Branch details not found. Please contact support.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-indigo-400" /> Security & Privacy
                 </h3>
                 <div className="space-y-4">
                    <SecurityToggle 
                      icon={<CreditCard className="w-5 h-5" />}
                      label="Transaction PIN"
                      desc="Requirement for all domestic transfers"
                    />
                    <SecurityToggle 
                      icon={<Globe className="w-5 h-5" />}
                      label="International Usage"
                      desc="Enable international transactions on cards"
                    />
                    <SecurityToggle 
                      icon={<Shield className="w-5 h-5" />}
                      label="2-Factor Authentication"
                      desc="Extra layer of security via SMS/App"
                    />
                 </div>
                 <div className="pt-8 border-t border-slate-800">
                    <button className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between transition group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                             <Lock className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                             <p className="text-white font-bold">Change Password</p>
                             <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                          </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition" />
                    </button>
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <SettingsIcon className="w-5 h-5 text-indigo-400" /> Account Settings
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <label className="block text-sm font-bold text-slate-400 mb-3">Dashboard Display Language</label>
                       <select 
                         disabled={!isEditing}
                         value={editData.language}
                         onChange={(e) => setEditData({...editData, language: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition disabled:opacity-50"
                       >
                          <option>English (US)</option>
                          <option>Hindi</option>
                          <option>Spanish</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-400 mb-3">Currency Preference</label>
                       <select 
                         disabled={!isEditing}
                         value={editData.currency}
                         onChange={(e) => setEditData({...editData, currency: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition disabled:opacity-50"
                       >
                          <option>INR - Indian Rupee (₹)</option>
                          <option>USD - US Dollar ($)</option>
                          <option>EUR - Euro (€)</option>
                       </select>
                    </div>
                    <div className="pt-6">
                       <h4 className="font-bold text-white mb-4">Notification Preferences</h4>
                       <div className="space-y-3">
                          <NotificationToggle label="Transaction Alerts" />
                          <NotificationToggle label="Promotional Offers" />
                          <NotificationToggle label="Monthly Statements" />
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-indigo-400" /> Account Status
              </h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">
                       <span>KYC Verification</span>
                       <span className="text-emerald-500">100% Complete</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                       <div className="h-full bg-indigo-500 w-full" />
                    </div>
                 </div>
                 <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Tier Level</p>
                    <p className="text-lg font-black text-white italic">Diamond Executive</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Limits</p>
                       <p className="text-sm font-bold text-white">{formatAmount(500000)} / Day</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Credit Score</p>
                       <p className="text-sm font-bold text-emerald-400">842</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600 rounded-3xl p-6 shadow-2xl shadow-indigo-500/20 text-white group cursor-pointer overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                 <Shield className="w-24 h-24" />
              </div>
              <h4 className="text-xl font-black mb-2 flex items-center gap-2 relative z-10">
                 Gold Privilege
              </h4>
              <p className="text-indigo-100 text-sm mb-6 opacity-80 relative z-10">You're eligible for a free locker in your home branch.</p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-black/10 group-hover:bg-indigo-50 transition relative z-10">
                 Claim Benefit
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function EditableField({ label, value, isEditing, onChange, type = "text", className = "" }: any) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">
        {label}
      </label>
      {isEditing ? (
        <input 
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-950 border border-indigo-500/50 px-4 py-3 rounded-xl text-white font-medium outline-none focus:border-indigo-500 transition shadow-[0_0_10px_rgba(99,102,241,0.1)]"
        />
      ) : (
        <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-slate-200 font-medium h-[46px] flex items-center">
          {value || `---`}
        </div>
      )}
    </div>
  );
}

function SecurityToggle({ icon, label, desc }: any) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-colors">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400">
             {icon}
          </div>
          <div>
             <p className="text-white font-bold text-sm">{label}</p>
             <p className="text-xs text-slate-500">{desc}</p>
          </div>
       </div>
       <button 
          onClick={() => setEnabled(!enabled)}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
       >
          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
       </button>
    </div>
  );
}

function NotificationToggle({ label }: { label: string }) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between py-2">
       <span className="text-sm text-slate-300 font-medium">{label}</span>
       <button 
          onClick={() => setEnabled(!enabled)}
          className={`w-10 h-5 rounded-full p-1 transition-colors duration-150 ${enabled ? 'bg-indigo-600' : 'bg-slate-800'}`}
       >
          <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-150 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
       </button>
    </div>
  );
}
