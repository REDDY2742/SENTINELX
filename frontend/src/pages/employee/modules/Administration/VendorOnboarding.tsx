import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Building2, 
  Phone, Mail, Globe, 
  ShieldCheck, ChevronRight,
  ChevronLeft, Loader2, Star
} from 'lucide-react';

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [posting, setPosting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: General Info
    name: '',
    category: 'Logistics',
    status: 'Active',
    rating: '4.5',
    
    // Step 2: Contact & Location
    contact: '',
    email: '',
    phone: '',
    website: '',
    headquarters: '',
    city: 'Bangalore',
    state: 'Karnataka',
    
    // Step 3: Service & Legal
    description: '',
    partnerSince: new Date().toISOString().split('T')[0],
    msaNumber: `MSA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    serviceCapacity: 'Full Regional Support',
    financialTier: 'Enterprise Grade',
    ticketsResolved: '142',
    uptimeScore: '99.8',
    contractExpiry: '2026-12-12'
  });

  const categories = [
    "Logistics", "IT Services", "Security", "Maintenance", 
    "Legal", "Marketing", "Consulting", "Catering"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setPosting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/administration/vendors', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        navigate('/employee/vendors');
      }
    } catch (err) {
      console.error('Failed to onboarding vendor:', err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/employee/vendors')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/50">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Cancel & Exit</span>
        </button>

        <div className="flex gap-2">
           {[1, 2, 3].map((s) => (
             <div 
               key={s}
               className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`}
             />
           ))}
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight">Onboard New Partner</h1>
        <p className="text-slate-500 font-medium">Follow the 3-step verification process to register a new vendor in the directory.</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 -z-10 blur-3xl"></div>
        
        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-4 text-indigo-400">
               <Building2 className="w-6 h-6" />
               <h3 className="text-lg font-bold">Step 1: Identity & Category</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vendor Entity Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter corporate name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:border-indigo-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50 appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Trust Rating</label>
                  <div className="relative">
                    <input 
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-indigo-500/50 outline-none"
                    />
                    <Star className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lifecycle Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50 appearance-none"
                  >
                    <option value="Active">Operational (Active)</option>
                    <option value="Review">Under Review</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-4 text-indigo-400">
               <Phone className="w-6 h-6" />
               <h3 className="text-lg font-bold">Step 2: Communication & Presence</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Contact Name</label>
                  <input 
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Full name of relationship manager"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-indigo-500/50 outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Business Email</label>
                  <div className="relative">
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="corporate@vendor.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-indigo-500/50 outline-none"
                    />
                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Direct Phone</label>
                  <div className="relative">
                    <input 
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-indigo-500/50 outline-none"
                    />
                    <Phone className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Corporate Website</label>
                  <div className="relative">
                    <input 
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="www.example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-indigo-500/50 outline-none"
                    />
                    <Globe className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">HQ Address / Local Headquarters</label>
                  <textarea 
                    name="headquarters"
                    rows={3}
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    placeholder="Provide full office address"
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-6 py-4 text-white focus:border-indigo-500/50 outline-none resize-none"
                  />
                </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-4 text-indigo-400">
               <ShieldCheck className="w-6 h-6" />
               <h3 className="text-lg font-bold">Step 3: Service Parameters & Legal</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Overview & Capabilities</label>
                  <textarea 
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the services this vendor will provide in detail..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-6 py-4 text-white focus:border-indigo-500/50 outline-none resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MSA Reference ID</label>
                  <input 
                    type="text"
                    name="msaNumber"
                    value={formData.msaNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Partnership Since</label>
                  <input 
                    type="date"
                    name="partnerSince"
                    value={formData.partnerSince}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50"
                  />
                </div>

                 <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Financial Tier</label>
                  <select 
                    name="financialTier"
                    value={formData.financialTier}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="Enterprise Grade">Enterprise Grade</option>
                    <option value="Tier 2 (Mid-Large)">Tier 2 (Mid-Large)</option>
                    <option value="SME / Boutique">SME / Boutique</option>
                    <option value="Startup/Sandbox">Startup/Sandbox</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Scope</label>
                  <select 
                    name="serviceCapacity"
                    value={formData.serviceCapacity}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="Global Presence">Global Presence</option>
                    <option value="National Backbone">National Backbone</option>
                    <option value="Full Regional Support">Full Regional Support</option>
                    <option value="City Specific">City Specific</option>
                  </select>
                </div>

                {/* Additional Dynamic Stats */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tickets Resolved</label>
                  <input 
                    type="number"
                    name="ticketsResolved"
                    value={formData.ticketsResolved}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Uptime Score (%)</label>
                  <input 
                    type="number"
                    step="0.1"
                    name="uptimeScore"
                    value={formData.uptimeScore}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-4 col-span-1 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contract Expiry Date</label>
                  <input 
                    type="date"
                    name="contractExpiry"
                    value={formData.contractExpiry}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
             </div>
          </div>
        )}

        <div className="mt-12 pt-12 border-t border-slate-800/50 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signed Under Protocol</span>
            <span className="text-xs text-indigo-400 font-bold tracking-tighter uppercase">STX-V-2024-ALPHA</span>
          </div>

          <div className="flex gap-4">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="px-8 py-4 rounded-2xl bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Step
              </button>
            )}

            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && !formData.name}
                className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={posting || !formData.contact || !formData.email}
                className="px-10 py-4 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {posting ? 'Syncing...' : 'Finalize Onboarding'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Safety Note */}
      <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 flex items-start gap-6">
        <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500">
           <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-2">Compliance & Data Integrity Notice</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            By finalizing this onboarding, you confirm that the vendor has cleared the primary security vetting process. 
            All stored credentials and contact points will be subject to quarterly audits by the SentinelX Risk Management team.
          </p>
        </div>
      </div>
    </div>
  );
}
