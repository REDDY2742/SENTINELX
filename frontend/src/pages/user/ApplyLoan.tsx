import React, { useState } from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  User, 
  Briefcase, 
  Home, 
  FileText, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Upload,
  CheckCircle2,
  Users,
  Loader2
} from 'lucide-react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dob?: string;
  creditScore?: number;
}

const loanTypes = [
  { id: 'personal', name: 'Personal Loan', rate: '10.5%', icon: '👤', desc: 'For personal needs and emergencies' },
  { id: 'home', name: 'Home Loan', rate: '8.5%', icon: '🏠', desc: 'Purchase or renovate your dream home' },
  { id: 'vehicle', name: 'Vehicle Loan', rate: '9.2%', icon: '🚗', desc: 'Finance your new or used car' },
  { id: 'education', name: 'Education Loan', rate: '7.5%', icon: '🎓', desc: 'Secure your academic future' },
  { id: 'business', name: 'Business Loan', rate: '12.0%', icon: '💼', desc: 'Scale your business operations' },
];

export default function ApplyLoan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useOutletContext<{ user: UserData }>();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  const editData = location.state?.application;
  const isEdit = location.state?.editMode;

  const [formData, setFormData] = useState({
    // Loan Details
    type: editData?.fullDetails?.type || 'personal',
    amount: editData?.amount?.toString() || '',
    tenure: editData?.fullDetails?.tenure || '24',
    purpose: editData?.fullDetails?.purpose || '',
    
    // Personal Details
    gender: editData?.fullDetails?.gender || 'male',
    maritalStatus: editData?.fullDetails?.maritalStatus || 'single',
    pan: editData?.fullDetails?.pan || '',
    aadhaar: editData?.fullDetails?.aadhaar || '',
    
    // Employment & Income
    occupation: editData?.fullDetails?.occupation || 'Salaried',
    employer: editData?.fullDetails?.employer || '',
    designation: editData?.fullDetails?.designation || '',
    monthlyIncome: editData?.fullDetails?.monthlyIncome || '',
    experience: editData?.fullDetails?.experience || '',
    
    // Family & Nominee
    nomineeName: editData?.fullDetails?.nomineeName || '',
    relation: editData?.fullDetails?.relation || 'Spouse',
    nomineePhone: editData?.fullDetails?.nomineePhone || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('access_token');
      const selectedType = loanTypes.find(t => t.id === formData.type);

      const url = isEdit 
        ? `http://13.201.79.48:8000/api/v1/auth/customer/apply/${editData.id}`
        : 'http://13.201.79.48:8000/api/v1/auth/customer/apply';

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: `${selectedType?.name} Request`,
          amount: Number(formData.amount),
          priority: Number(formData.amount) > 1000000 ? 'high' : 'medium',
          status: 'pending',
          fullDetails: formData, // Sending everything
          timestamp: isEdit ? editData.timestamp : new Date().toISOString()
        })
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        setStep(5); // Success step
      } else {
        toast.error('Failed to submit application');
      }
    } catch (err) {
      toast.error('A server error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${step >= i ? 'text-indigo-400' : 'text-slate-600'}`}>
              {i === 1 ? 'Loan' : i === 2 ? 'Personal' : i === 3 ? 'Employment' : 'Nominee'}
            </span>
          </div>
          {i < 4 && <div className={`flex-1 h-0.5 mx-4 rounded-full transition-colors ${step > i ? 'bg-indigo-600' : 'bg-slate-800'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button 
        onClick={() => navigate('/user/loans')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Loans
      </button>

      {step < 5 && (
        <>
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-white mb-3">{isEdit ? 'Update Your Application' : 'Apply for New Loan'}</h1>
            <p className="text-slate-400">{isEdit ? 'Correct any details in your pending request.' : 'Complete the 4-step process to secure your funding.'}</p>
          </div>

          {renderStepIndicator()}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            {/* Step 1: Loan Configuration */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loanTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleInputChange('type', type.id)}
                      className={`p-6 rounded-2xl border text-left transition group ${
                        formData.type === type.id 
                          ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                          : 'bg-slate-950 border-slate-800 hover:border-indigo-500/40 text-slate-400'
                      }`}
                    >
                      <div className="text-3xl mb-4">{type.icon}</div>
                      <h4 className={`font-bold mb-1 ${formData.type === type.id ? 'text-white' : ''}`}>{type.name}</h4>
                      <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{type.desc}</p>
                      <span className="text-xs font-black text-indigo-400">{type.rate} P.A.</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                  <FormInput 
                    label="Desired Amount (₹)" 
                    icon={<DollarSign className="w-4 h-4" />}
                    placeholder="e.g. 5,00,000"
                    type="number"
                    value={formData.amount}
                    onChange={(val: string) => handleInputChange('amount', val)}
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Tenure (Months)</label>
                    <select 
                      value={formData.tenure}
                      onChange={(e) => handleInputChange('tenure', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-indigo-500 transition shadow-inner"
                    >
                      <option value="12">12 Months (1 Year)</option>
                      <option value="24">24 Months (2 Year)</option>
                      <option value="36">36 Months (3 Year)</option>
                      <option value="60">60 Months (5 Year)</option>
                      <option value="120">120 Months (10 Year)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <FormInput 
                      label="Loan Purpose" 
                      icon={<FileText className="w-4 h-4" />}
                      placeholder="Mention the reason for taking this loan..."
                      isTextArea
                      value={formData.purpose}
                      onChange={(val: string) => handleInputChange('purpose', val)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput label="Full Name" icon={<User className="w-4 h-4" />} value={`${user?.firstName} ${user?.lastName}`} disabled />
                  <FormInput label="Email Address" icon={<FileText className="w-4 h-4" />} value={user?.email} disabled />
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Gender</label>
                    <div className="flex gap-4">
                      {['male', 'female', 'other'].map(g => (
                        <button
                          key={g}
                          onClick={() => handleInputChange('gender', g)}
                          className={`flex-1 py-3 rounded-xl border font-bold capitalize transition ${
                            formData.gender === g ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Marital Status</label>
                    <div className="flex gap-4">
                      {['single', 'married', 'divorced'].map(m => (
                        <button
                          key={m}
                          onClick={() => handleInputChange('maritalStatus', m)}
                          className={`flex-1 py-3 rounded-xl border font-bold capitalize transition ${
                            formData.maritalStatus === m ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <FormInput 
                    label="PAN Card Number" 
                    icon={<ShieldCheck className="w-4 h-4" />} 
                    placeholder="ABCDE1234F" 
                    value={formData.pan}
                    onChange={(val: string) => handleInputChange('pan', val)}
                  />
                  <FormInput 
                    label="Aadhaar Number" 
                    icon={<ShieldCheck className="w-4 h-4" />} 
                    placeholder="XXXX XXXX XXXX" 
                    value={formData.aadhaar}
                    onChange={(val: string) => handleInputChange('aadhaar', val)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Employment & Income */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Current Occupation</label>
                    <select 
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-indigo-500 transition shadow-inner"
                    >
                      <option>Salaried</option>
                      <option>Self Employed Professional</option>
                      <option>Business Owner</option>
                      <option>Student</option>
                      <option>Homemaker</option>
                    </select>
                  </div>
                  <FormInput 
                    label={
                      formData.occupation === 'Student' ? "College / University Name" :
                      formData.occupation === 'Business Owner' ? "Business Name" :
                      formData.occupation === 'Salaried' ? "Company Name" :
                      "Firm / Practice Name"
                    }
                    icon={<Briefcase className="w-4 h-4" />} 
                    placeholder={
                      formData.occupation === 'Student' ? "e.g. Stanford University" :
                      formData.occupation === 'Business Owner' ? "e.g. Acme Tech Solutions" :
                      "e.g. Google Inc."
                    } 
                    value={formData.employer}
                    onChange={(val: string) => handleInputChange('employer', val)}
                  />
                  {formData.occupation !== 'Student' && (
                    <FormInput 
                      label="Current Designation" 
                      icon={<Briefcase className="w-4 h-4" />} 
                      placeholder="e.g. Senior Architect" 
                      value={formData.designation}
                      onChange={(val: string) => handleInputChange('designation', val)}
                    />
                  )}
                  <FormInput 
                    label={formData.occupation === 'Student' ? "Monthly Allowance / Stipend (₹)" : "Monthly Net Income (₹)"}
                    icon={<DollarSign className="w-4 h-4" />} 
                    placeholder="e.g. 50,000" 
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(val: string) => handleInputChange('monthlyIncome', val)}
                  />
                  <FormInput 
                    label={formData.occupation === 'Student' ? "Current Year of Study" : "Total Work Experience (Years)"}
                    icon={<Briefcase className="w-4 h-4" />} 
                    placeholder={formData.occupation === 'Student' ? "e.g. 3rd Year" : "e.g. 8"} 
                    value={formData.experience}
                    onChange={(val: string) => handleInputChange('experience', val)}
                  />
                </div>

                {/* Specialized Loan Fields */}
                <div className="pt-8 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-indigo-400 mb-6 flex items-center gap-2">
                    <Info className="w-4 h-4" /> {loanTypes.find(t => t.id === formData.type)?.name} Specific Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {formData.type === 'home' && (
                      <>
                        <FormInput label="Property Address" icon={<Home className="w-4 h-4" />} placeholder="Full address of the property..." />
                        <FormInput label="Estimated Property Value (₹)" icon={<DollarSign className="w-4 h-4" />} placeholder="e.g. 50,00,000" type="number" />
                      </>
                    )}
                    {formData.type === 'vehicle' && (
                      <>
                        <FormInput label="Vehicle Model" icon={<Briefcase className="w-4 h-4" />} placeholder="e.g. Tesla Model 3" />
                        <FormInput label="Showroom / Dealer Name" icon={<Briefcase className="w-4 h-4" />} placeholder="e.g. Tesla NYC" />
                      </>
                    )}
                    {formData.type === 'education' && (
                      <>
                        <FormInput label="Course Name" icon={<FileText className="w-4 h-4" />} placeholder="e.g. Masters in Data Science" />
                        <FormInput label="Institute / University Name" icon={<Briefcase className="w-4 h-4" />} placeholder="e.g. MIT" />
                      </>
                    )}
                    {formData.type === 'business' && (
                      <>
                        <FormInput label="Business Registration Number" icon={<ShieldCheck className="w-4 h-4" />} placeholder="GSTIN / VAT / Registration" />
                        <FormInput label="Years in Business" icon={<Briefcase className="w-4 h-4" />} placeholder="e.g. 5" type="number" />
                      </>
                    )}
                    {formData.type === 'personal' && (
                      <div className="md:col-span-2">
                        <FormInput label="Special Requirements (If any)" icon={<FileText className="w-4 h-4" />} placeholder="Additional information for your application..." isTextArea />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-4 ml-1">Document Uploads (Self Attested PDF/JPG)</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DocUpload label={formData.occupation === 'Student' ? "College ID Card" : "Salary Slips (3M)"} />
                    <DocUpload label="Bank Statement" />
                    <DocUpload label="ID Proof" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Family & References */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput 
                    label="Nominee Full Name" 
                    icon={<Users className="w-4 h-4" />} 
                    placeholder="John Doe" 
                    value={formData.nomineeName}
                    onChange={(val: string) => handleInputChange('nomineeName', val)}
                  />
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Relationship</label>
                    <select 
                      value={formData.relation}
                      onChange={(e) => handleInputChange('relation', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-indigo-500 transition"
                    >
                      <option>Spouse</option>
                      <option>Parent</option>
                      <option>Sibling</option>
                      <option>Child</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <FormInput 
                    label="Nominee Phone Number" 
                    icon={<Briefcase className="w-4 h-4" />} 
                    placeholder="+91 XXXXX XXXXX" 
                    value={formData.nomineePhone}
                    onChange={(val: string) => handleInputChange('nomineePhone', val)}
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex gap-4 text-sm text-amber-200">
                  <Info className="w-6 h-6 shrink-0 text-amber-500" />
                  <div>
                    <p className="font-bold mb-1">Notice</p>
                    <p className="leading-relaxed opacity-80">By submitting this application, you authorize Sentinel Bank to conduct credit verifications and contact references if necessary. Ensure all data is accurate to prevent rejection.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-between items-center gap-4 border-t border-slate-800 pt-8">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className={`px-8 py-3.5 rounded-xl font-bold transition-all ${
                  step === 1 ? 'invisible' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95'
                }`}
              >
                Previous Step
              </button>
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3.5 rounded-xl font-bold shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  Next Step <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white px-12 py-3.5 rounded-xl font-extra-bold shadow-xl shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {submitting ? 'Finalizing...' : 'Submit Final Application'}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Success Step */}
      {step === 5 && (
        <div className="text-center py-20 px-8 animate-in zoom-in fade-in duration-500">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Application {isEdit ? 'Updated' : 'Submitted'}!</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-12 text-lg leading-relaxed">
            Your loan application for ₹{Number(formData.amount).toLocaleString('en-IN')} has been {isEdit ? 'successfully updated' : 'sent to our verification team'}. 
            You can track the status in your loans dashboard. Reference: <span className="text-indigo-400 font-mono">{editData?.id || `SENT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}</span>
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/user/loans')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition shadow-xl shadow-indigo-500/20"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormInput({ label, icon, placeholder, value, onChange, type = "text", isTextArea, disabled }: {
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  type?: string;
  isTextArea?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-wider">{label}</label>
      <div className="relative group">
        <div className={`absolute left-4 ${isTextArea ? 'top-4' : 'top-1/2 -translate-y-1/2'} text-slate-500 group-focus-within:text-indigo-500 transition`}>
          {icon}
        </div>
        {isTextArea ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500/50 transition placeholder:text-slate-700 shadow-inner resize-none"
          />
        ) : (
          <input 
            type={type} 
            value={value}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500/50 transition placeholder:text-slate-700 shadow-inner ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        )}
      </div>
    </div>
  );
}

function DocUpload({ label }: { label: string }) {
  return (
    <div className="p-4 bg-slate-950 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 transition group cursor-pointer">
      <Upload className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition" />
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter group-hover:text-slate-300">{label}</span>
    </div>
  );
}
