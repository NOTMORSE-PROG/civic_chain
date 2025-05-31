import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { civicchainActor, userRoles } from '../utils/icp';
import { Shield, Building, Users, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    barangay: '',
    code: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const manilaBarangays = [
    "Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5",
    "Barangay 6", "Barangay 7", "Barangay 8", "Barangay 9", "Barangay 10",
    "Barangay 11", "Barangay 12", "Barangay 13", "Barangay 14", "Barangay 15",
    "Barangay 16", "Barangay 17", "Barangay 18", "Barangay 19", "Barangay 20",
    "Ermita", "Intramuros", "Malate", "Paco", "Pandacan", "Port Area",
    "Quiapo", "Sampaloc", "San Andres", "San Miguel", "San Nicolas",
    "Santa Ana", "Santa Cruz", "Santa Mesa", "Tondo", "Binondo"
  ];

  const policeStations = [
    "Manila Police District - Station 1 (Intramuros)",
    "Manila Police District - Station 2 (Ermita)",
    "Manila Police District - Station 3 (Malate)",
    "Manila Police District - Station 4 (Paco)",
    "Manila Police District - Station 5 (Pandacan)",
    "Manila Police District - Station 6 (Quiapo)",
    "Manila Police District - Station 7 (Sampaloc)",
    "Manila Police District - Station 8 (San Miguel)",
    "Manila Police District - Station 9 (Santa Ana)",
    "Manila Police District - Station 10 (Santa Cruz)",
    "Manila Police District - Station 11 (Tondo)",
    "Manila Police District - Station 12 (Binondo)"
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({
      name: '',
      email: '',
      department: '',
      barangay: '',
      code: ''
    });
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Register new user
        const department = selectedRole.includes('Police') ? formData.department : null;
        const barangay = selectedRole.includes('Barangay') ? formData.barangay : null;
        
        const result = await civicchainActor.registerUser(
          formData.name,
          formData.email,
          { [selectedRole]: null },
          department ? [department] : [],
          barangay ? [barangay] : []
        );

        if ('ok' in result) {
          const userData = {
            id: result.ok,
            name: formData.name,
            email: formData.email,
            role: selectedRole,
            department,
            barangay
          };
          
          login(userData);
          navigate('/dashboard');
        } else {
          setError(result.err);
        }
      } else {
        // Simple login simulation (in real app, this would verify credentials)
        const userData = {
          id: `user_${Date.now()}`,
          name: formData.name,
          email: formData.email,
          role: selectedRole,
          department: selectedRole.includes('Police') ? formData.department : null,
          barangay: selectedRole.includes('Barangay') ? formData.barangay : null
        };
        
        login(userData);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    if (role.includes('Police')) return Shield;
    if (role.includes('Barangay')) return Building;
    return Users;
  };

  const getRoleColor = (role) => {
    if (role.includes('Police')) return 'bg-blue-500';
    if (role.includes('Barangay')) return 'bg-green-500';
    return 'bg-purple-500';
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">CivicChain</h1>
            <p className="text-xl text-gray-600">Community Governance & Reporting Platform</p>
            <p className="text-lg text-gray-500 mt-2">Manila City</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {userRoles.map((role) => {
              const Icon = getRoleIcon(role.value);
              const colorClass = getRoleColor(role.value);
              
              return (
                <div
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className="bg-white rounded-xl shadow-lg p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                    {role.label}
                  </h3>
                  <p className="text-gray-600 text-center text-sm">
                    {role.value === 'Citizen' && 'Submit reports, vote on proposals, track community issues'}
                    {role.value === 'Police' && 'Manage cases, respond to reports, maintain public safety'}
                    {role.value === 'BarangayOfficial' && 'Handle local issues, manage barangay affairs'}
                    {role.value === 'HeadPolice' && 'Oversee police operations, assign cases, manage officers'}
                    {role.value === 'HeadBarangay' && 'Lead barangay governance, create proposals, manage officials'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${getRoleColor(selectedRole)} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {React.createElement(getRoleIcon(selectedRole), { className: "w-8 h-8 text-white" })}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {userRoles.find(r => r.value === selectedRole)?.label}
          </h2>
          <p className="text-gray-600 mt-2">
            {isRegistering ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          {selectedRole.includes('Police') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Police Station
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Police Station</option>
                {policeStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedRole.includes('Barangay') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barangay
              </label>
              <select
                name="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Barangay</option>
                {manilaBarangays.map((barangay) => (
                  <option key={barangay} value={barangay}>
                    {barangay}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!selectedRole.includes('Citizen') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  placeholder="Enter department access code"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-civic-blue hover:underline text-sm"
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setSelectedRole('')}
              className="text-gray-500 hover:underline text-sm"
            >
              ← Back to role selection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;