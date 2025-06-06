"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { getActor } from "../utils/icp"
import { Shield, Building, Users, Eye, EyeOff } from "lucide-react"
import Logo from "../components/Logo"

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  </div>
)

const Home = () => {
  const [selectedRole, setSelectedRole] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    idNumber: "",
    department: "",
    barangay: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState(null)

  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Initialize ICP actor
  useEffect(() => {
    const initActor = async () => {
      try {
        console.log("Initializing actor in Home component...")
        await getActor()
        console.log("Actor initialized successfully")
        setIsInitializing(false)
      } catch (error) {
        console.error("Failed to initialize actor:", error)
        setInitError(error.message)
        setIsInitializing(false)
      }
    }

    initActor()
  }, [])

  // Only redirect to dashboard if user is authenticated and we're not showing the form
  useEffect(() => {
    if (user && !selectedRole && location.pathname === "/") {
      navigate("/dashboard")
    }
  }, [user, selectedRole, navigate, location])

  if (isInitializing) {
    return <LoadingSpinner />
  }

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-gray-50 rounded-lg border">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Initialization Error</h2>
          <p className="text-red-600 mb-6">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

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
    setFormData({
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      idNumber: "",
      department: "",
      barangay: "",
    })
    setError("")
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const formatRoleForBackend = (roleStr) => {
    const validRoles = ["Citizen", "Police", "BarangayOfficial"];
    if (!validRoles.includes(roleStr)) {
      throw new Error("Invalid role selected");
    }
    return roleStr;
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^09\d{9}$/
    return phoneRegex.test(phone.replace(/\s+/g, ""))
  }

  const validateIDNumber = (id, role) => {
    if (role === "Police") {
      return /^MPD-\d{5}$/.test(id);
    } else if (role === "BarangayOfficial") {
      return /^BRGY-\d{5}$/.test(id);
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!selectedRole) {
        setError("Please select a role")
        setLoading(false)
        return
      }

      const formattedRole = formatRoleForBackend(selectedRole)

      if (isRegistering) {
        // Registration validation
        if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
          setError("Please fill in all required fields")
          setLoading(false)
          return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          setError("Please enter a valid email address")
          setLoading(false)
          return
        }

        // Phone number validation
        if (!validatePhoneNumber(formData.phoneNumber)) {
          setError("Please enter a valid Philippine mobile number (09XX XXX XXXX)")
          setLoading(false)
          return
        }

        // Password validation
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long")
          setLoading(false)
          return
        }

        // Role-specific validation
        if (selectedRole.includes("Police") || selectedRole.includes("Barangay")) {
          if (!formData.idNumber) {
            setError(`Please enter your ${selectedRole.includes("Police") ? "Police" : "Barangay"} ID number`)
            setLoading(false)
            return
          }

          if (!validateIDNumber(formData.idNumber, selectedRole)) {
            setError(`Please enter a valid ${selectedRole.includes("Police") ? "Police" : "Barangay"} ID number`)
            setLoading(false)
            return
          }

          if (selectedRole.includes("Police") && !formData.department) {
            setError("Please select a police station")
            setLoading(false)
            return
          }

          if (selectedRole.includes("Barangay") && !formData.barangay) {
            setError("Please select a barangay")
            setLoading(false)
            return
          }
        }

        // Prepare registration data
        const departments = selectedRole.includes("Police") && formData.department ? [formData.department] : []
        const barangays = selectedRole.includes("Barangay") && formData.barangay ? [formData.barangay] : []

        // Attempt registration
        const result = await register(
          formData.name,
          formData.email,
          formData.password,
          selectedRole,
          departments,
          barangays,
          formData.phoneNumber,
          formData.idNumber
        )

        if (result.success) {
          // Auto-login after successful registration
          const loginResult = await login(
            selectedRole === "Citizen" ? formData.email : formData.idNumber,
            formData.password,
            selectedRole
          )

          if (loginResult.success) {
            // Check user role after successful auto-login
            if (result.success) { navigate("/dashboard"); }
            else {
              navigate("/dashboard")
            }
          } else {
            setError("Registration successful but login failed. Please try logging in.")
          }
        } else {
          setError(result.error || "Registration failed. Please try again.")
        }
      } else {
        // Login validation
        const identifier = selectedRole === "Citizen" ? formData.email : formData.idNumber
        if (!identifier) {
          setError(`Please enter your ${selectedRole === "Citizen" ? "email" : "ID number"}`)
          setLoading(false)
          return
        }

        if (!formData.password) {
          setError("Please enter your password")
          setLoading(false)
          return
        }

        // Attempt login
        const result = await login(
          identifier,
          formData.password,
          formattedRole
        )

        if (result.success) {
          // Check user role after successful login
          if (user && (user.role === "HeadBarangay" || user.role === "HeadPolice")) {
            navigate("/head-dashboard")
          } else {
            navigate("/dashboard")
          }
        } else {
          setError(result.error || "Invalid credentials. Please try again.")
        }
      }
    } catch (err) {
      console.error("Form submission error:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role) => {
    if (role.includes("Police")) return Shield
    if (role.includes("Barangay")) return Building
    return Users
  }

  const governmentPortals = [
    {
      value: "Citizen",
      label: "Citizen Portal",
      description: "Submit reports and access community services",
      icon: Users,
      color: "bg-blue-600",
    },
    {
      value: "Police",
      label: "Police Portal",
      description: "Law enforcement and public safety management",
      icon: Shield,
      color: "bg-red-600",
    },
    {
      value: "BarangayOfficial",
      label: "Barangay Portal",
      description: "Manage local community affairs and services",
      icon: Building,
      color: "bg-green-600",
    },
  ];

  // If no role is selected, show the simple landing page
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-white">
        {/* Simple Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Logo size="md" inHomePage={false} />
              <div className="text-sm text-gray-600">City of Manila - Digital Services</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold !text-black mb-4">CivicChain Manila</h1>
            <p className="text-xl text-gray-600 mb-8">Digital governance platform for the City of Manila</p>
            <p className="text-gray-500">Select your portal to access government services</p>
          </div>

          {/* Access Portals */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {governmentPortals.map((portal) => {
              const Icon = portal.icon
              return (
                <div
                  key={portal.value}
                  onClick={() => handleRoleSelect(portal.value)}
                  className="bg-white border-2 border-gray-200 rounded-lg p-8 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className={`w-16 h-16 ${portal.color} rounded-lg flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">{portal.label}</h3>
                  <p className="text-gray-600 text-center">{portal.description}</p>
                </div>
              )
            })}
          </div>
        </main>

        {/* Simple Footer */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Logo size="sm" inHomePage={false} />
                <p className="text-gray-600 mt-4">
                  Digital governance platform for transparent and efficient public service delivery.
                </p>
              </div>

              <div>
                <h4 className="font-semibold !text-black mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Citizen Portal
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Submit Report
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      View Proposals
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Announcements
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold !text-black mb-4">Contact</h4>
                <div className="text-gray-600 space-y-2">
                  <p>City Hall, Manila</p>
                  <p>Phone: (02) 8527-4000</p>
                  <p>Email: info@manila.gov.ph</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
              <p>&copy; 2025 City Government of Manila. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // If a role is selected, show the simple login/register form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-6" inHomePage={false} />
          <div
            className={`w-16 h-16 ${governmentPortals.find((p) => p.value === selectedRole)?.color} rounded-lg flex items-center justify-center mx-auto mb-4`}
          >
            {React.createElement(getRoleIcon(selectedRole), { className: "w-8 h-8 text-white" })}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {governmentPortals.find((p) => p.value === selectedRole)?.label}
          </h2>
          <p className="text-gray-600">{isRegistering ? "Create your account" : "Sign in to continue"}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isRegistering ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isRegistering ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="09XX XXX XXXX"
                    required
                  />
                </div>

                {(selectedRole.includes("Police") || selectedRole.includes("Barangay")) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedRole.includes("Police") ? "Police ID Number" : "Barangay ID Number"}
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={selectedRole.includes("Police") ? "MPD-XXXXX" : "BRGY-XXXXX"}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {selectedRole.includes("Police") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Police Station</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {selectedRole.includes("Barangay") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                    <select
                      name="barangay"
                      value={formData.barangay}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              </>
            ) : (
              <>
                {selectedRole === "Citizen" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedRole.includes("Police") ? "Police ID Number" : "Barangay ID Number"}
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter your ${selectedRole.includes("Police") ? "Police" : "Barangay"} ID number`}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : isRegistering ? "Create Account" : "Sign In"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setSelectedRole("")}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back to portal selection
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
