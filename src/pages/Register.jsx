import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { getActor, userRoles } from "../utils/icp"
import {
  Shield,
  Building,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Lock,
  Smartphone,
  Monitor,
  Vote,
  MapPin,
  Bell,
  Award,
  BarChart3,
  FileText,
  Network,
  Book,
  Code,
  User,
  BadgeCheck,
  Mail,
  Key,
  Map,
} from "lucide-react"
import Logo from "../components/Logo"

const Register = () => {
  const [selectedRole, setSelectedRole] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    barangay: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const manilaBarangays = [
    "Barangay 1",
    "Barangay 2",
    "Barangay 3",
    "Barangay 4",
    "Barangay 5",
    "Barangay 6",
    "Barangay 7",
    "Barangay 8",
    "Barangay 9",
    "Barangay 10",
    "Barangay 11",
    "Barangay 12",
    "Barangay 13",
    "Barangay 14",
    "Barangay 15",
    "Barangay 16",
    "Barangay 17",
    "Barangay 18",
    "Barangay 19",
    "Barangay 20",
    "Ermita",
    "Intramuros",
    "Malate",
    "Paco",
    "Pandacan",
    "Port Area",
    "Quiapo",
    "Sampaloc",
    "San Andres",
    "San Miguel",
    "San Nicolas",
    "Santa Ana",
    "Santa Cruz",
    "Santa Mesa",
    "Tondo",
    "Binondo",
  ]

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
    "Manila Police District - Station 12 (Binondo)",
  ]

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setError("")
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      const departments = selectedRole === "Police Officer" || selectedRole === "Head of Police" ? [formData.department] : []
      const barangays = selectedRole === "Barangay Official" || selectedRole === "Head of Barangay" ? [formData.barangay] : []

      const actor = await getActor()
      const result = await actor.registerUser(
        formData.name,
        formData.email,
        { [selectedRole]: null },
        departments,
        barangays
      )

      if ("Ok" in result) {
        const userData = {
          id: result.Ok,
          name: formData.name,
          email: formData.email,
          role: selectedRole,
          department: departments[0] || null,
          barangay: barangays[0] || null,
        }
        login(userData)
        navigate("/dashboard")
      } else {
        setError(result.Err)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role) => {
    if (role.includes("Police")) return Shield
    if (role.includes("Barangay")) return Building
    return Users
  }

  const getRoleColor = (role) => {
    if (role.includes("Police")) return "from-blue-500 to-blue-600"
    if (role.includes("Barangay")) return "from-green-500 to-green-600"
    return "from-purple-500 to-purple-600"
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-20 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-1000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Choose Your Role</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-4">
              Select your role to create an account and start making a difference in your community
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl px-6 py-3">
              <Lock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-200 text-sm font-medium">Secure role-based registration</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {userRoles.map((role) => {
              const Icon = getRoleIcon(role.value)
              const gradientClass = getRoleColor(role.value)

              return (
                <div
                  key={role.value}
                  onClick={() => handleRoleSelect(role.value)}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-10 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:bg-white/10 border border-white/20 hover:border-white/40"
                >
                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-24 h-24 bg-gradient-to-br ${gradientClass} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </div>

                    <h3 className="text-3xl font-bold text-center text-white mb-6">{role.label}</h3>

                    <p className="text-blue-200 text-center leading-relaxed mb-8 text-lg">
                      {role.value === "Citizen" &&
                        "Submit reports, vote on proposals, track community issues and participate in local governance through our mobile app"}
                      {role.value === "Police" &&
                        "Manage cases, respond to reports, maintain public safety and serve the community through our web portal"}
                      {role.value === "BarangayOfficial" &&
                        "Handle local issues, manage barangay affairs and serve constituents through dedicated tools"}
                      {role.value === "HeadPolice" &&
                        "Oversee police operations, assign cases, manage officers and ensure public safety with advanced analytics"}
                      {role.value === "HeadBarangay" &&
                        "Lead barangay governance, create proposals, manage officials and drive community development"}
                    </p>

                    <div className="flex items-center justify-center text-blue-300 group-hover:text-white transition-colors">
                      <span className="text-lg font-bold mr-3">Register as {role.label}</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-6" inHomePage={false} />
          <div
            className={`w-16 h-16 bg-gradient-to-br ${getRoleColor(selectedRole)} rounded-2xl flex items-center justify-center mx-auto mb-4`}
          >
            {React.createElement(getRoleIcon(selectedRole), { className: "w-8 h-8 text-white" })}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Register as {userRoles.find((r) => r.value === selectedRole)?.label}
          </h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {(selectedRole === "Police" || selectedRole === "HeadPolice") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Police Station</label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              </div>
            )}

            {(selectedRole === "BarangayOfficial" || selectedRole === "HeadBarangay") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              </div>
            )}

            {!selectedRole.includes("Citizen") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Code</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter department access code"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${getRoleColor(selectedRole)} text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={() => setSelectedRole("")}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← Back to role selection
              </button>
              <div>
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register 