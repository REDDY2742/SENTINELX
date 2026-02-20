import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, AlertTriangle, User, Briefcase,ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { BrandLogo } from '../../components/BrandLogo';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'personal' | 'corporate'>('personal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_client_id');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Auto-switch tabs based on email domain
  useEffect(() => {
    const emailLower = email.toLowerCase();
    if (emailLower.endsWith('@gmail.com')) {
      setActiveTab('personal');
    } else if (emailLower.endsWith('@sentinelbank.com')) {
      setActiveTab('corporate');
    }
  }, [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);

    try {
      const response = await fetch('http://13.201.79.48:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Check if 2FA is required
      if (data.require_2fa) {
        setShowOtpModal(true);
        setLoading(false);
        return;
      }

      // Store access token
      localStorage.setItem('access_token', data.access_token);
      
      // Decode JWT to get role
      const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
      const userRole = tokenPayload.role;

      // Role-based validation
      if (activeTab === 'personal') {
        // Personal tab: Only allow customers
        if (userRole !== 'customer') {
          setError('This login is for personal banking customers only. Please use Corporate login for employee access.');
          localStorage.removeItem('access_token');
          setLoading(false);
          return;
        }
      } else if (activeTab === 'corporate') {
        // Corporate tab: Only allow employees/chairman/admin
        if (userRole === 'customer') {
          setError('This login is for bank employees only. Please use Personal login for customer access.');
          localStorage.removeItem('access_token');
          setLoading(false);
          return;
        }
      }

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('remembered_client_id', email);
      } else {
        localStorage.removeItem('remembered_client_id');
      }

      // Redirect based on role
      if (userRole === 'chairman' || userRole === 'admin') {
        navigate('/chairman');
      } else if (userRole === 'customer') {
        navigate('/user');
      } else {
        // All other employee roles (manager, teller, etc.)
        navigate('/employee');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        return;
    }

    setVerifying(true);
    setError('');

    try {
        const response = await fetch('http://13.201.79.48:8000/api/v1/auth/otp/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: email,
                otp: otp
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'OTP verification failed');

        // Store access token
        localStorage.setItem('access_token', data.access_token);
        
        // Decode JWT to get role
        const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
        const userRole = tokenPayload.role;

        // Redirect based on role
        if (userRole === 'chairman' || userRole === 'admin') {
            navigate('/chairman');
        } else if (userRole === 'customer') {
            navigate('/user');
        } else {
            navigate('/employee');
        }
    } catch (err: any) {
        setError(err.message || 'Verification failed');
    } finally {
        setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* Left Side - Security & Info */}
        <div className="md:w-1/2 p-12 bg-indigo-900 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
           
           <div>
              <Link to="/" className="flex items-center gap-3 mb-12">
                <BrandLogo className="w-10 h-10" />
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Sentinel Bank
                </span>
              </Link>
              <h1 className="text-4xl font-extrabold mb-6 leading-tight">Secure Access to Your Financial World</h1>
              <p className="text-indigo-200 text-lg mb-8">Bank with confidence using our industry-leading encryption and fraud protection systems.</p>
           </div>
           
           <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium bg-white/5 p-4 rounded-xl border border-white/10">
                 <Lock className="w-5 h-5 text-emerald-400" /> 
                 <span>256-Bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium bg-white/5 p-4 rounded-xl border border-white/10">
                 <ShieldCheck className="w-5 h-5 text-emerald-400" /> 
                 <span>Fraud Prevention System Active</span>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                 <div className="flex items-start gap-3 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 text-yellow-200 text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p>Never share your OTP or Password with anyone. Sentinel Bank officials will never ask for sensitive details via call or SMS.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-12 bg-white">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
              <div className="text-sm text-slate-500">
                 New user? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register Now</Link>
              </div>
           </div>

           {/* Tabs - Personal vs Corporate */}
           <div className="flex mb-8 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'personal' ? 'bg-white text-indigo-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 <User className="w-4 h-4" /> Personal Banking
              </button>
              <button 
                onClick={() => setActiveTab('corporate')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'corporate' ? 'bg-white text-indigo-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
              >
                 <Briefcase className="w-4 h-4" /> Corporate Login
              </button>
           </div>

           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                 <div className="relative group">
                   <Mail className="absolute w-5 h-5 text-slate-400 left-4 top-3.5 group-focus-within:text-indigo-500 transition" />
                   <input 
                     type="text" 
                     placeholder={activeTab === 'corporate' ? "Employee ID / Email" : "Username or Email"}
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-medium"
                   />
                 </div>
                 
                 <div className="relative group">
                   <Lock className="absolute w-5 h-5 text-slate-400 left-4 top-3.5 group-focus-within:text-indigo-500 transition" />
                   <input 
                     type="password" 
                     placeholder="Password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition font-medium"
                   />
                 </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" 
                  />
                  <span className="text-slate-600">Remember Client ID</span>
                </label>
                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 transition">Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-xl text-lg ${
                  loading
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {loading ? 'Authenticating...' : 'Secure Login'} <LogIn className="w-5 h-5" />
              </button>
           </form>
           
            <div className="mt-8 text-center bg-slate-50 p-4 rounded-xl text-xs text-slate-400 border border-slate-100">
               <p className="mt-1">By logging in, you agree to our Terms of Use and Privacy Policy.</p>
            </div>
         </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100 animate-in zoom-in duration-200">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Two-Factor Auth</h3>
                    <p className="text-slate-500 mt-2">Enter the verification code sent to <strong>{email}</strong></p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                        <input 
                           type="text" 
                           placeholder="000000"
                           maxLength={6}
                           value={otp}
                           onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                           className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-0 outline-none transition"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-medium text-center">{error}</div>
                    )}

                    <button 
                        type="submit"
                        disabled={verifying || otp.length !== 6}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {verifying ? 'Verifying...' : 'Verify & Sign In'}
                    </button>

                    <button 
                        type="button"
                        onClick={() => setShowOtpModal(false)}
                        className="w-full text-slate-500 text-sm font-medium hover:text-slate-700"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
