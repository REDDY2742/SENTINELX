import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Bell, Shield, 
  Globe, Database, 
  Save, ChevronRight, Lock, Laptop,
  Cpu, Activity, Loader2, Trash2,
  Smartphone, Landmark,
  AlertTriangle, Fingerprint, Server
} from 'lucide-react';
import toast from 'react-hot-toast';

const defaultSettings = {
  // Profile / General
  region: 'Central Asia (Mumbai Core)',
  timezone: '(GMT +05:30) India Standard Time',
  operatingHours: { start: '09:00', end: '18:30' },
  currency: 'INR (₹) - Indian Rupee',
  devices: [
    { name: 'MacBook Pro - Branch Hub 01', type: 'Manager Console', status: 'Authorized', lastSeen: 'Active Now' },
    { name: 'Dell Precision - Front Desk 4', type: 'Cashier Terminal', status: 'Verified', lastSeen: '2h ago' }
  ],
  // Operations
  maxWithdrawal: 500000,
  maxDeposit: 2000000,
  vaultLimit: 10000000,
  autoReconcile: true,
  // Access Control
  ipWhitelist: '192.168.1.1, 10.0.0.45',
  staffLockout: 3,
  sessionTimeout: 15,
  // Notifications
  highValueAlert: true,
  alertThreshold: 100000,
  lowCashAlert: true,
  // Security
  enforce2FA: true,
  biometricAuth: false,
  encryptionLevel: 'AES-256-GCM'
};

export default function BranchSettings() {
  const [config, setConfig] = useState<any>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile Settings');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/branch-management/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.settings && Object.keys(data.settings).length > 0) {
        setConfig({ ...defaultSettings, ...data.settings });
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/employee/branch-management/settings', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        toast.success('Branch configuration updated');
      }
    } catch (err) {
      toast.error('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const removeDevice = (index: number) => {
    const updatedDevices = config.devices.filter((_: any, i: number) => i !== index);
    setConfig({ ...config, devices: updatedDevices });
    toast.success('Device authorization revoked');
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
          <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-500/10 rounded-2xl flex items-center justify-center border border-slate-500/20 text-slate-400">
                  <Settings className="w-8 h-8" />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Branch Configuration</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage departmental access, operational thresholds and regional preferences</p>
              </div>
          </div>
          <button 
            disabled={saving}
            onClick={handleSave}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.5rem] font-bold flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
             {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save All Changes
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
              {[
                { label: 'Profile Settings', icon: <User /> },
                { label: 'Branch Operations', icon: <Landmark /> },
                { label: 'Access Control', icon: <Lock /> },
                { label: 'Notifications', icon: <Bell /> },
                { label: 'Security & Auth', icon: <Shield /> },
                { label: 'System Logs', icon: <Activity /> },
              ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveTab(item.label)}
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${
                      activeTab === item.label ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}>
                      <div className={`p-2 rounded-lg ${activeTab === item.label ? 'bg-white/10' : 'bg-slate-900'}`}>
                          {React.cloneElement(item.icon as any, { className: 'w-4 h-4' })}
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto ${activeTab === item.label ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
              ))}
          </div>

          <div className="lg:col-span-3">
              {activeTab === 'Profile Settings' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10">
                          <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-6 flex items-center gap-3">
                              <Globe className="w-6 h-6 text-indigo-400" /> Operational Context
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reporting Region</label>
                                  <select 
                                    value={config.region}
                                    onChange={(e) => setConfig({ ...config, region: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-indigo-500/50 appearance-none font-medium cursor-pointer flex items-center"
                                  >
                                      <option>South-East Asia (Singapore HQ)</option>
                                      <option>European Union (Berlin Hub)</option>
                                      <option>North America (Austin Data Center)</option>
                                      <option>Central Asia (Mumbai Core)</option>
                                  </select>
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Branch Timezone</label>
                                  <select 
                                    value={config.timezone}
                                    onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-indigo-500/50 appearance-none font-medium cursor-pointer"
                                  >
                                      <option>(GMT +05:30) India Standard Time</option>
                                      <option>(GMT +00:00) UTC / Western Europe</option>
                                      <option>(GMT -05:00) Eastern Standard Time</option>
                                  </select>
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operating Hours Threshold</label>
                                  <div className="grid grid-cols-2 gap-4">
                                      <input 
                                        value={config.operatingHours?.start}
                                        onChange={(e) => setConfig({ ...config, operatingHours: { ...config.operatingHours, start: e.target.value } })}
                                        type="time" className="bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" 
                                      />
                                      <input 
                                        value={config.operatingHours?.end}
                                        onChange={(e) => setConfig({ ...config, operatingHours: { ...config.operatingHours, end: e.target.value } })}
                                        type="time" className="bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none" 
                                      />
                                  </div>
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Branch Currency</label>
                                  <select 
                                    value={config.currency}
                                    onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500/50 appearance-none font-medium cursor-pointer"
                                  >
                                      <option>INR (₹) - Indian Rupee</option>
                                      <option>USD ($) - US Dollar</option>
                                      <option>EUR (€) - Euro</option>
                                  </select>
                              </div>
                          </div>

                          <div className="mt-12 p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                               <div className="flex gap-4 items-center">
                                   <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                     <Database className="w-6 h-6" />
                                   </div>
                                   <div>
                                       <h4 className="text-sm font-bold text-white uppercase tracking-tight">Mainframe Data Synchronization</h4>
                                       <p className="text-[10px] text-indigo-300 font-medium tracking-tight">Real-time sync enabled with Sentinel Core Ledger across all nodes.</p>
                                   </div>
                               </div>
                               <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Link</span>
                               </div>
                          </div>
                      </div>

                      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10">
                          <div className="flex items-center justify-between mb-8">
                              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                  <Laptop className="w-6 h-6 text-indigo-400" /> Authorized Hardware
                              </h3>
                              <button 
                                onClick={() => toast.success('MAC Address scanner initiated')}
                                className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors"
                              >
                                Add New Device
                              </button>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                              {config.devices?.map((device: any, i: number) => (
                                  <div key={i} className="p-6 rounded-[2rem] bg-slate-950/40 border border-slate-800/50 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                      <div className="flex items-center gap-5">
                                          <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-all">
                                              <Cpu className="w-6 h-6" />
                                          </div>
                                          <div>
                                              <h4 className="text-sm font-bold text-white uppercase tracking-tight">{device.name}</h4>
                                              <div className="flex items-center gap-3 mt-1.5">
                                                  <span className="text-[10px] font-bold text-slate-500 uppercase">{device.type}</span>
                                                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                  <span className="text-[10px] font-bold text-emerald-500 uppercase">{device.status}</span>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">{device.lastSeen}</span>
                                        <button 
                                          onClick={() => removeDevice(i)}
                                          className="p-2 text-slate-700 hover:text-rose-500 transition-all"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'Branch Operations' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10">
                        <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-6 flex items-center gap-3">
                            <Landmark className="w-6 h-6 text-indigo-400" /> Transaction Thresholds
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <InputField 
                              label="Maximum Withdrawal Request (₹)" 
                              value={config.maxWithdrawal} 
                              onChange={(v: any) => setConfig({...config, maxWithdrawal: v})}
                            />
                            <InputField 
                              label="Maximum Daily Deposit (₹)" 
                              value={config.maxDeposit} 
                              onChange={(v: any) => setConfig({...config, maxDeposit: v})}
                            />
                            <InputField 
                              label="Overnight Vault Limit (₹)" 
                              value={config.vaultLimit} 
                              onChange={(v: any) => setConfig({...config, vaultLimit: v})}
                            />
                            <div className="space-y-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reconciliation Mode</label>
                               <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                                  <span className="text-sm text-slate-300 font-medium">Auto-Reconcile at Day End</span>
                                  <button 
                                    onClick={() => setConfig({...config, autoReconcile: !config.autoReconcile})}
                                    className={`w-12 h-6 rounded-full transition-all relative ${config.autoReconcile ? 'bg-indigo-600' : 'bg-slate-800'}`}
                                  >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.autoReconcile ? 'left-7' : 'left-1'}`} />
                                  </button>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'Access Control' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10">
                        <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-6 flex items-center gap-3">
                            <Server className="w-6 h-6 text-indigo-400" /> Network & Authorization
                        </h3>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">IP Whitelist (Comma separated)</label>
                                <textarea 
                                  value={config.ipWhitelist}
                                  onChange={(e) => setConfig({...config, ipWhitelist: e.target.value})}
                                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-white font-mono outline-none focus:border-indigo-500/50 transition-all h-32"
                                  placeholder="e.g. 192.168.1.1, 203.0.113.4"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <InputField 
                                  label="Staff Lockout Attempts" 
                                  value={config.staffLockout} 
                                  onChange={(v: any) => setConfig({...config, staffLockout: v})}
                                />
                                <InputField 
                                  label="Inactive Session Timeout (Min)" 
                                  value={config.sessionTimeout} 
                                  onChange={(v: any) => setConfig({...config, sessionTimeout: v})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'Notifications' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10">
                        <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-6 flex items-center gap-3">
                            <Bell className="w-6 h-6 text-indigo-400" /> Alert Management
                        </h3>
                        <div className="space-y-6">
                            <ToggleBox 
                              icon={<AlertTriangle />}
                              label="High Value Transaction Alerts"
                              description="Notify branch head when a transaction exceeds threshold"
                              isActive={config.highValueAlert}
                              onToggle={() => setConfig({...config, highValueAlert: !config.highValueAlert})}
                            />
                            {config.highValueAlert && (
                              <div className="pl-16 animate-in fade-in slide-in-from-left-4">
                                <InputField 
                                  label="Alert Threshold (₹)" 
                                  value={config.alertThreshold} 
                                  onChange={(v: any) => setConfig({...config, alertThreshold: v})}
                                />
                              </div>
                            )}
                            <ToggleBox 
                              icon={<Activity />}
                              label="Liquidity Level Warnings"
                              description="Alert when branch cash-in-hand falls below 10% of vault limit"
                              isActive={config.lowCashAlert}
                              onToggle={() => setConfig({...config, lowCashAlert: !config.lowCashAlert})}
                            />
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'Security & Auth' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10">
                        <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-6 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-indigo-400" /> System Hardening
                        </h3>
                        <div className="space-y-6">
                            <ToggleBox 
                              icon={<Smartphone />}
                              label="Multi-Factor Authentication"
                              description="Require OTP verification for all management-level actions"
                              isActive={config.enforce2FA}
                              onToggle={() => setConfig({...config, enforce2FA: !config.enforce2FA})}
                            />
                            <ToggleBox 
                              icon={<Fingerprint />}
                              label="Biometric Verification"
                              description="Enable Fingerprint/FaceID for secure cashier login (Hardware required)"
                              isActive={config.biometricAuth}
                              onToggle={() => setConfig({...config, biometricAuth: !config.biometricAuth})}
                            />
                            <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                      <Lock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">Active Encryption</h4>
                                        <p className="text-[10px] text-indigo-300 font-medium tracking-tight">System is currently utilizing {config.encryptionLevel} grade protection.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'System Logs' && (
                  <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[3rem] p-10 space-y-8 animate-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white flex items-center gap-3">
                              <Activity className="w-6 h-6 text-indigo-400" /> System Access Logs
                          </h3>
                          <div className="flex gap-2">
                             <span className="text-[10px] font-black text-slate-600 bg-slate-950 px-3 py-1 rounded-full uppercase tracking-widest">Real-time</span>
                          </div>
                      </div>
                      
                      <div className="space-y-4">
                          {[
                            { time: '17:15:22', level: 'INFO', msg: 'System integrity check passed. Ledger synced.', user: 'SYSTEM' },
                            { time: '17:10:05', level: 'AUTH', msg: 'Admin login successful from IP: 192.168.1.15', user: 'Narsimha' },
                            { time: '16:55:40', level: 'WARN', msg: 'Elevated transaction volume detected in Zone B.', user: 'MONITOR' },
                            { time: '16:42:15', level: 'INFO', msg: 'New device "Dell Precision" verified by manager.', user: 'Narsimha' },
                            { time: '16:30:00', level: 'SYS', msg: 'Automated daily backup completed successfully.', user: 'CRON-TASK' },
                          ].map((log, i) => (
                              <div key={i} className="font-mono text-[11px] p-4 bg-slate-950 rounded-2xl border border-slate-800/50 flex gap-6 hover:bg-slate-950 transition-colors">
                                  <span className="text-slate-600">{log.time}</span>
                                  <span className={`font-bold ${
                                      log.level === 'WARN' ? 'text-amber-500' : 
                                      log.level === 'AUTH' ? 'text-indigo-400' : 
                                      log.level === 'SYS' ? 'text-emerald-500' : 'text-blue-500'
                                  }`}>[{log.level}]</span>
                                  <span className="text-slate-300 flex-1">{log.msg}</span>
                                  <span className="text-slate-500 uppercase font-black tracking-tighter">{log.user}</span>
                              </div>
                          ))}
                      </div>

                      <button className="w-full py-4 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                          <RefreshCcw className="w-3 h-3" /> Fetch Historical Logs (Last 24h)
                      </button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <input 
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500 transition-all outline-none font-medium" 
        />
    </div>
  );
}

function ToggleBox({ icon, label, description, isActive, onToggle }: any) {
  return (
    <div className="p-6 rounded-[2rem] bg-slate-950/40 border border-slate-800/50 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-all">
                {React.cloneElement(icon, { className: 'w-6 h-6' })}
            </div>
            <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-tight">{label}</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{description}</p>
            </div>
        </div>
        <button 
          onClick={onToggle}
          className={`w-12 h-6 rounded-full transition-all relative ${isActive ? 'bg-indigo-600' : 'bg-slate-800'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isActive ? 'left-7' : 'left-1'}`} />
        </button>
    </div>
  );
}

function RefreshCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
