import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, Home, MapPin, Calendar, CreditCard, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BrandLogo } from '../../components/BrandLogo';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);

  // Fetch branches on mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/public/branches');
        const data = await response.json();
        if (data.branches) {
          setBranches(data.branches);
        }
      } catch (err) {
        console.error('Failed to fetch branches');
      }
    };
    fetchBranches();
  }, []);

  // Helpers for dropdowns
  const states = Array.from(new Set(branches.map(b => b.location?.split(',')?.pop()?.trim() || ''))).filter(Boolean).sort();
  const getCitiesInState = (state: string) => {
    return Array.from(new Set(
      branches
        .filter(b => b.location?.includes(state))
        .map(b => b.location?.split(',')?.[b.location?.split(',')?.length - 2]?.trim() || '')
    )).filter(Boolean).sort();
  };
  const getBranchesInCity = (city: string) => {
    return branches.filter(b => b.location?.includes(city));
  };

  // Validation Schemas
  const step1Schema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone is required'),
    dateOfBirth: Yup.date()
      .required('Date of birth is required')
      .max(new Date(), 'Date cannot be in the future')
      .test('age', "We don't provide account for minors", function(value) {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
      }),
  });

  const step2Schema = Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    branchId: Yup.string().required('Please select a branch'),
    pincode: Yup.string().matches(/^[0-9]{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
    accountType: Yup.string().oneOf(['savings', 'current']).required('Account type is required'),
    initialDeposit: Yup.number()
      .min(500, 'Minimum deposit of ₹500 is required')
      .required('Initial deposit is required'),
  });

  const step3Schema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Must contain one uppercase letter')
      .matches(/[a-z]/, 'Must contain one lowercase letter')
      .matches(/[0-9]/, 'Must contain one number')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      branchId: '',
      branch: '',
      pincode: '',
      accountType: 'savings',
      initialDeposit: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    validationSchema: step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('https://13.201.79.48:8000/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: values.email.split('@')[0],
            email: values.email,
            password: values.password,
            role: 'customer',
            permissions: ['account:view', 'transaction:create'],
            
            // Personal Details
            firstName: values.firstName,
            lastName: values.lastName,
            phone: String(values.phone),
            dateOfBirth: String(values.dateOfBirth),
            
            // Address & Branch
            address: values.address,
            city: values.city,
            state: values.state,
            pincode: String(values.pincode),
            branch: values.branch,
            branchId: values.branchId,
            
            // Account Details
            accountType: values.accountType,
            initialDeposit: String(values.initialDeposit),
            accountNumber: `SB${Date.now()}`,
            accountStatus: 'active',
            balance: String(values.initialDeposit || '0')
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle FastAPI validation errors (422) which return detail as an array
          const errorMsg = Array.isArray(data.detail) 
            ? data.detail.map((err: any) => `${err.loc[err.loc.length-1]}: ${err.msg}`).join(', ')
            : data.detail || 'Registration failed';
          throw new Error(errorMsg);
        }

        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (err: any) {
        setError(err.message || 'Registration failed. Please try again.');
        setLoading(false);
      }
    },
  });

  const sendOTP = async () => {
    if (formik.errors.email || !formik.values.email) {
      formik.setFieldTouched('email', true);
      return;
    }

    setSendingOtp(true);
    setError('');

    try {
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/send-verification-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formik.values.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send OTP');
      }

      setOtpSent(true);
      alert(`OTP sent to ${formik.values.email}. Please check your inbox.`);

    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formik.values.email, otp })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Invalid OTP');
      }

      setEmailVerified(true);
      alert('✅ Email verified successfully!');

    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      if (step === 1 && !emailVerified) {
        setError('Please verify your email first');
        return;
      }
      setStep(step + 1);
      setError('');
    } else {
      // Mark all fields as touched to show errors
      Object.keys(errors).forEach(field => {
        formik.setFieldTouched(field, true);
      });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-emerald-200 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Account Created Successfully! 🎉</h2>
          <p className="text-slate-600 mb-6">Welcome to Sentinel Bank!</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <p className="text-sm text-slate-500 mb-1">Your Email</p>
            <p className="font-bold text-slate-900">{formik.values.email}</p>
          </div>
          <p className="text-sm text-slate-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-4 mb-2">
            <BrandLogo className="w-16 h-16" />
            <h1 className="text-3xl font-bold text-slate-900">Open Your Account</h1>
          </div>
          <p className="text-slate-600">Join Sentinel Bank and start your financial journey</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 ml-2 first:ml-0">
              <div className={`h-2 rounded-full ${step >= s ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <p className={`text-xs mt-2 font-medium ${step >= s ? 'text-indigo-600' : 'text-slate-400'}`}>
                {s === 1 ? 'Personal Info' : s === 2 ? 'Address' : 'Security'}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      {...formik.getFieldProps('firstName')}
                      placeholder="First Name"
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : 'border-slate-200'}`}
                    />
                  </div>
                  {formik.touched.firstName && formik.errors.firstName && <p className="text-xs text-red-500 ml-1">{formik.errors.firstName}</p>}
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    {...formik.getFieldProps('lastName')}
                    placeholder="Last Name"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {formik.touched.lastName && formik.errors.lastName && <p className="text-xs text-red-500 ml-1">{formik.errors.lastName}</p>}
                </div>
              </div>

              {/* Inline OTP Verification */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      {...formik.getFieldProps('email')}
                      placeholder="Email Address"
                      disabled={emailVerified}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        emailVerified ? 'bg-emerald-50 border-emerald-300' : formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-200'
                      }`}
                    />
                  </div>

                  {formik.values.email.includes('@') && !emailVerified && !otpSent && (
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={sendingOtp}
                      className="px-6 py-3 rounded-xl font-semibold whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      {sendingOtp ? '...' : 'Send OTP'}
                    </button>
                  )}

                  {otpSent && !emailVerified && (
                    <>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="OTP"
                        className="w-24 px-3 py-3 text-center text-lg font-bold bg-white border-2 border-indigo-300 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={verifyOTP}
                        className="px-6 py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        Verify
                      </button>
                    </>
                  )}

                  {emailVerified && (
                    <div className="px-6 py-3 bg-emerald-600 text-white rounded-xl flex items-center gap-2 font-semibold">
                      <CheckCircle className="w-5 h-5" /> Verified
                    </div>
                  )}
                </div>
                {formik.touched.email && formik.errors.email && <p className="text-xs text-red-500 ml-1">{formik.errors.email}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="tel"
                    {...formik.getFieldProps('phone')}
                    placeholder="Mobile Number"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && <p className="text-xs text-red-500 ml-1">{formik.errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    {...formik.getFieldProps('dateOfBirth')}
                    placeholder="Date of Birth"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'border-red-500' : 'border-slate-200'}`}
                  />
                </div>
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && <p className="text-xs text-red-500 ml-1">{formik.errors.dateOfBirth}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Address Details</h3>
              
              <div className="space-y-1">
                <div className="relative">
                  <Home className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    {...formik.getFieldProps('address')}
                    placeholder="Street Address"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-slate-200'}`}
                  />
                </div>
                {formik.touched.address && formik.errors.address && <p className="text-xs text-red-500 ml-1">{formik.errors.address}</p>}
              </div>

                <div className="space-y-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                    <select
                      {...formik.getFieldProps('state')}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue('city', '');
                        formik.setFieldValue('branchId', '');
                        formik.setFieldValue('branch', '');
                      }}
                      className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none ${formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-slate-200'}`}
                    >
                      <option value="">Select State</option>
                      {states.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                  </div>
                  {formik.touched.state && formik.errors.state && <p className="text-xs text-red-500 ml-1">{formik.errors.state}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="relative">
                      <select
                        {...formik.getFieldProps('city')}
                        disabled={!formik.values.state}
                        onChange={(e) => {
                          formik.handleChange(e);
                          formik.setFieldValue('branchId', '');
                          formik.setFieldValue('branch', '');
                        }}
                        className={`w-full px-4 pr-10 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-slate-200'} ${!formik.values.state ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">Select City</option>
                        {formik.values.state && getCitiesInState(formik.values.state).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                    </div>
                    {formik.touched.city && formik.errors.city && <p className="text-xs text-red-500 ml-1">{formik.errors.city}</p>}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="relative">
                      <select
                        {...formik.getFieldProps('branchId')}
                        disabled={!formik.values.city}
                        onChange={(e) => {
                          const bId = e.target.value;
                          const branchObj = branches.find(b => b.id === bId);
                          formik.setFieldValue('branchId', bId);
                          formik.setFieldValue('branch', branchObj?.name || '');
                        }}
                        className={`w-full px-4 pr-10 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none ${formik.touched.branchId && formik.errors.branchId ? 'border-red-500' : 'border-slate-200'} ${!formik.values.city ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">Select Branch</option>
                        {formik.values.city && getBranchesInCity(formik.values.city).map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                    </div>
                    {formik.touched.branchId && formik.errors.branchId && <p className="text-xs text-red-500 ml-1">{formik.errors.branchId}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    {...formik.getFieldProps('pincode')}
                    placeholder="Pincode (6 digits)"
                    maxLength={6}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.pincode && formik.errors.pincode ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {formik.touched.pincode && formik.errors.pincode && <p className="text-xs text-red-500 ml-1">{formik.errors.pincode}</p>}
                </div>

              <div className="pt-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Account Type</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['savings', 'current'].map((type) => (
                    <label key={type} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${formik.values.accountType === type ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                      <input
                        type="radio"
                        name="accountType"
                        value={type}
                        checked={formik.values.accountType === type}
                        onChange={formik.handleChange}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 capitalize">{type} Account</p>
                        <p className="text-xs text-slate-500">{type === 'savings' ? 'Earn interest' : 'For business'}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="number"
                    {...formik.getFieldProps('initialDeposit')}
                    placeholder="Initial Deposit (Minimum ₹500)"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.initialDeposit && formik.errors.initialDeposit ? 'border-red-500' : 'border-slate-200'}`}
                  />
                </div>
                {formik.touched.initialDeposit && formik.errors.initialDeposit && <p className="text-xs text-red-500 ml-1">{formik.errors.initialDeposit}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Security</h3>
              
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    {...formik.getFieldProps('password')}
                    placeholder="Create Password"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-200'}`}
                  />
                </div>
                {formik.touched.password && formik.errors.password && <p className="text-xs text-red-500 ml-1">{formik.errors.password}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    {...formik.getFieldProps('confirmPassword')}
                    placeholder="Confirm Password"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-slate-200'}`}
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{formik.errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start gap-3 pt-4">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formik.values.agreeToTerms}
                  onChange={formik.handleChange}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded"
                />
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    I agree to the <span className="text-indigo-600 font-medium hover:underline">Terms</span> and <span className="text-indigo-600 font-medium hover:underline">Privacy Policy</span>.
                  </p>
                  {formik.touched.agreeToTerms && formik.errors.agreeToTerms && <p className="text-xs text-red-500">{formik.errors.agreeToTerms}</p>}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl font-semibold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-xl"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-xl ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {loading ? 'Processing...' : 'Create My Account'} <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already a member? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
