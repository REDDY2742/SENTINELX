import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Lock, Briefcase, Search, Edit2, Trash2, Shield, Loader2 } from 'lucide-react';

const BANK_ROLES = [
  { value: 'accountant', label: 'Accountant', permissions: ['finance:read', 'finance:write', 'report:generate'] },
  { value: 'administration', label: 'Administration', permissions: ['office:manage', 'user:read', 'report:generate', 'inventory:manage'] },
  { value: 'assistant_manager', label: 'Assistant Manager', permissions: ['branch:read', 'loan:review', 'user:read'] },
  { value: 'audit_officer', label: 'Audit Officer', permissions: ['audit:read', 'transaction:view', 'report:audit'] },
  { value: 'branch_manager', label: 'Branch Manager', permissions: ['branch:read', 'branch:write', 'loan:approve', 'user:read'] },
  { value: 'cashier', label: 'Cashier', permissions: ['transaction:create', 'cash:manage', 'vault:access'] },
  { value: 'chairman', label: 'Chairman', permissions: ['all:access', 'user:create', 'user:delete', 'user:edit', 'system:admin'] },
  { value: 'compliance_officer', label: 'Compliance Officer', permissions: ['audit:read', 'fraud:view', 'compliance:write'] },
  { value: 'customer_service', label: 'Customer Service Officer', permissions: ['customer:read', 'customer:write', 'transaction:view'] },
  { value: 'it_support', label: 'IT Support', permissions: ['system:read', 'user:reset_password'] },
  { value: 'loan_officer', label: 'Loan Officer', permissions: ['loan:create', 'loan:review', 'customer:read'] },
  { value: 'operations_staff', label: 'Operations Staff', permissions: ['operation:read', 'operation:write'] },
  { value: 'relationship_manager', label: 'Relationship Manager', permissions: ['customer:read', 'customer:write', 'loan:create'] },
  { value: 'security_officer', label: 'Security Officer', permissions: ['logs:view', 'access:monitor', 'alert:respond'] },
  { value: 'teller', label: 'Teller', permissions: ['transaction:create', 'customer:read'] },
];

const DEFAULT_PASSWORD = 'Sentinel@123';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    branch: '',
    role: '',
    employmentType: 'full-time',
    dateOfJoining: new Date().toISOString().split('T')[0],
    salary: '',
    employeeId: '',
    address: '',
    city: '',
    state: '',
    emergencyContact: '',
    emergencyPhone: '',
    email: '',
    password: DEFAULT_PASSWORD
  });
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    employeeId: '',
    dateOfJoining: '',
    department: '',
    branch: '',
    role: '',
    employmentType: 'full-time',
    salary: '',
    emergencyContact: '',
    emergencyPhone: '',
    permissions: [] as string[]
  });

  // Auto-generate email from first name
  useEffect(() => {
    if (formData.firstName) {
      const email = `${formData.firstName.toLowerCase().replace(/\s+/g, '')}@sentinel.com`;
      setFormData(prev => ({ ...prev, email }));
    } else {
      // Clear email if first name is empty
      setFormData(prev => ({ ...prev, email: '' }));
    }
  }, [formData.firstName]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedRole = BANK_ROLES.find(r => r.value === formData.role);
    
    try {
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          username: formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          role: formData.role,
          permissions: selectedRole?.permissions || [],
          // Employee Details
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          // Employment Information
          employeeId: formData.employeeId,
          dateOfJoining: formData.dateOfJoining,
          department: formData.department,
          branch: formData.branch,
          employmentType: formData.employmentType,
          salary: formData.salary,
          // Emergency Contact
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone
        })
      });

      if (response.ok) {
        alert(`✅ Employee added successfully!\n\nEmail: ${formData.email}\nPassword: ${formData.password}\n\nPlease share these credentials with the employee.`);
        setShowAddModal(false);
        setFormData({ 
          firstName: '', 
          lastName: '', 
          phone: '',
          department: '',
          branch: '',
          role: '', 
          employmentType: 'full-time',
          dateOfJoining: new Date().toISOString().split('T')[0],
          salary: '',
          employeeId: '',
          address: '',
          city: '',
          state: '',
          emergencyContact: '',
          emergencyPhone: '',
          email: '', 
          password: DEFAULT_PASSWORD 
        });
        fetchEmployees();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    if (!confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`https://13.201.79.48:8000/api/v1/auth/users/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        alert(`✅ Employee ${employeeName} deleted successfully!`);
        fetchEmployees(); // Reload the list
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const handleEditEmployee = (employee: any) => {
    console.log('Editing employee:', employee);
    
    setSelectedEmployee(employee);
    setEditFormData({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      phone: employee.phone || '',
      address: employee.address || '',
      city: employee.city || '',
      state: employee.state || '',
      employeeId: employee.employeeId || '',
      dateOfJoining: employee.dateOfJoining || '',
      department: employee.department || '',
      branch: employee.branch || '',
      role: employee.role || '',
      employmentType: employee.employmentType || 'full-time',
      salary: employee.salary || '',
      emergencyContact: employee.emergencyContact || '',
      emergencyPhone: employee.emergencyPhone || '',
      permissions: employee.permissions || []
    });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://13.201.79.48:8000/api/v1/auth/users/${selectedEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...editFormData,
          permissions: BANK_ROLES.find(r => r.value === editFormData.role)?.permissions || []
        })
      });

      if (response.ok) {
        alert(`✅ Employee updated successfully!`);
        setShowEditModal(false);
        setSelectedEmployee(null);
        fetchEmployees();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://13.201.79.48:8000/api/v1/auth/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load employees on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('Token exists:', !!token);
    console.log('Token value:', token);
    
    if (!token) {
      console.error('No access token found! Please login again.');
      alert('Session expired. Please login again.');
      window.location.href = '/login';
      return;
    }
    
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => 
    (emp.role !== 'customer') && 
    (selectedRole === 'All' || emp.role === selectedRole) && (
      emp.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Employee Management</h1>
          <p className="text-slate-400">Manage bank employees and their access permissions</p>
        </div>
        <div className="px-6 py-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3 shadow-lg">
          <span className="text-indigo-400 font-medium text-lg">Total Employees:</span>
          <span className="text-3xl font-bold text-white">
            {employees.filter(e => e.role !== 'chairman').length}
          </span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
            />
          </div>
          
          <div className="w-56">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '.65em auto' }}
            >
              <option value="All">All Roles</option>
              {BANK_ROLES.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-4 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          <UserPlus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Permissions</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                   <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                      <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">Retrieving Directory...</p>
                   </div>
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
               <tr>
                 <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                   No employees found. Add your first employee to get started.
                 </td>
               </tr>
            ) : (
               filteredEmployees.map((employee, idx) => (
                <tr key={idx} className="hover:bg-slate-800 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-semibold border border-indigo-700">
                        {employee.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {employee.firstName && employee.lastName 
                            ? `${employee.firstName} ${employee.lastName}`
                            : employee.username}
                        </div>
                        <div className="text-xs text-slate-400">{employee.employeeId || employee.id?.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{employee.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium border border-blue-700">
                      {BANK_ROLES.find(r => r.value === employee.role)?.label || employee.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {employee.permissions?.length || 0} permissions
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition"
                        title="Edit employee"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400 hover:text-white" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(employee.id, employee.username)}
                        className="p-2 hover:bg-red-900/50 rounded-lg transition"
                        title="Delete employee"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Employee</h2>
            
            <form onSubmit={handleAddEmployee} className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-4 border-b border-slate-700 pb-2">Personal Information</h3>
                
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email (Auto-generated)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg"
                      placeholder="Email will be generated"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-4 border-b border-slate-700 pb-2">Employment Details</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Employee ID</label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date of Joining *</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfJoining}
                      onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Role *
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="" className="bg-slate-800">Select a role...</option>
                      {BANK_ROLES.map(role => (
                        <option key={role.value} value={role.value} className="bg-slate-800">{role.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Employment Type *</label>
                    <select
                      required
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="full-time" className="bg-slate-800">Full-Time</option>
                      <option value="part-time" className="bg-slate-800">Part-Time</option>
                      <option value="contract" className="bg-slate-800">Contract</option>
                      <option value="intern" className="bg-slate-800">Intern</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Department *</label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="" className="bg-slate-800">Select department...</option>
                      <option value="retail-banking" className="bg-slate-800">Retail Banking</option>
                      <option value="corporate-banking" className="bg-slate-800">Corporate Banking</option>
                      <option value="loans" className="bg-slate-800">Loans & Credit</option>
                      <option value="operations" className="bg-slate-800">Operations</option>
                      <option value="it" className="bg-slate-800">IT & Technology</option>
                      <option value="hr" className="bg-slate-800">Human Resources</option>
                      <option value="compliance" className="bg-slate-800">Compliance & Risk</option>
                      <option value="finance" className="bg-slate-800">Finance & Accounts</option>
                      <option value="Banking Ops" className="bg-slate-800">Banking Ops</option>
                      <option value="Support" className="bg-slate-800">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Branch *</label>
                    <input
                      type="text"
                      required
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="e.g., Mumbai Main Branch"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Annual Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                    placeholder="600000"
                    min="0"
                    step="1000"
                  />
                  <p className="mt-1 text-xs text-slate-500">Enter annual salary in Indian Rupees</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-4 border-b border-slate-700 pb-2">Emergency Contact</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* System Access */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-4 border-b border-slate-700 pb-2">System Access</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Default Password
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg font-mono"
                  />
                  <p className="mt-1 text-xs text-amber-500 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Employee should change this password on first login
                  </p>
                </div>

                {/* Permissions Preview */}
                {formData.role && (
                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Assigned Permissions:</h3>
                    <div className="flex flex-wrap gap-2">
                      {BANK_ROLES.find(r => r.value === formData.role)?.permissions.map(perm => (
                        <span key={perm} className="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-xs text-slate-400">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-4xl border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Employee</h2>
            
            <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold border border-indigo-700">
                  {selectedEmployee.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-white">{selectedEmployee.username}</div>
                  <div className="text-sm text-slate-400">{selectedEmployee.email}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateEmployee} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
                    <input
                      required
                      type="text"
                      value={editFormData.firstName}
                      onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
                    <input
                      required
                      type="text"
                      value={editFormData.lastName}
                      onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                    <input
                      type="text"
                      value={editFormData.address}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
                    <input
                      type="text"
                      value={editFormData.state}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Employment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Employee ID</label>
                    <input
                      type="text"
                      value={editFormData.employeeId}
                      onChange={(e) => setEditFormData({ ...editFormData, employeeId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date of Joining</label>
                    <input
                      type="date"
                      value={editFormData.dateOfJoining}
                      onChange={(e) => setEditFormData({ ...editFormData, dateOfJoining: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Role *
                    </label>
                    <select
                      required
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="" className="bg-slate-800">Select a role...</option>
                      {BANK_ROLES.map(role => (
                        <option key={role.value} value={role.value} className="bg-slate-800">{role.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Employment Type</label>
                    <select
                      value={editFormData.employmentType}
                      onChange={(e) => setEditFormData({ ...editFormData, employmentType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
                    <select
                      value={editFormData.department}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">Select Department...</option>
                      <option value="retail-banking">Retail Banking</option>
                      <option value="corporate-banking">Corporate Banking</option>
                      <option value="loans">Loans & Credit</option>
                      <option value="operations">Operations</option>
                      <option value="it">IT & Technology</option>
                      <option value="hr">Human Resources</option>
                      <option value="compliance">Compliance & Risk</option>
                      <option value="finance">Finance & Accounts</option>
                      <option value="Banking Ops">Banking Ops</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Branch</label>
                    <input
                      type="text"
                      value={editFormData.branch}
                      onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Annual Salary (₹)</label>
                    <input
                      type="number"
                      value={editFormData.salary}
                      onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                      placeholder="e.g., 500000"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={editFormData.emergencyContact}
                      onChange={(e) => setEditFormData({ ...editFormData, emergencyContact: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={editFormData.emergencyPhone}
                      onChange={(e) => setEditFormData({ ...editFormData, emergencyPhone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Permissions Preview */}
              {editFormData.role && (
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Permissions:</h3>
                  <div className="flex flex-wrap gap-2">
                    {BANK_ROLES.find(r => r.value === editFormData.role)?.permissions.map(perm => (
                      <span key={perm} className="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-xs text-slate-400">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="px-6 py-2.5 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Update Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
