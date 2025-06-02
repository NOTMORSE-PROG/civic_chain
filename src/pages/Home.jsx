import React, { useState, Suspense, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
} from "lucide-react"
import Logo from "../components/Logo"

// No Error Boundary needed here as it's already in App.jsx

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
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
    code: "",
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
        console.log('Initializing actor in Home component...');
        await getActor();
        console.log('Actor initialized successfully');
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize actor:', error);
        setInitError(error.message);
        setIsInitializing(false);
      }
    };

    initActor();
  }, []);

  // Only redirect to dashboard if user is authenticated and we're not showing the form
  useEffect(() => {
    if (user && !selectedRole && location.pathname === '/') {
      navigate("/dashboard");
    }
  }, [user, selectedRole, navigate, location]);

  if (isInitializing) {
    return <LoadingSpinner />;
  }

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Initialization Error</h2>
          <p className="text-red-200 mb-6">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
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
      code: "",
    })
    setError("")
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Helper to convert role string to proper Motoko variant format
  const formatRoleForBackend = (roleStr) => {
    // Verify the role is valid
    const validRoles = ["Citizen", "Police", "BarangayOfficial", "HeadPolice", "HeadBarangay"];
    if (!validRoles.includes(roleStr)) {
      throw new Error(`Invalid role: ${roleStr}. Role must be one of: ${validRoles.join(', ')}`);
    }
    
    // When sending variants to Motoko from JavaScript through Candid,
    // we need to format them as a string with the variant name
    return roleStr;
  };

  // Add phone number validation
  const validatePhoneNumber = (phone) => {
    // Philippine mobile number format: 09XX XXX XXXX
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  // Add ID number validation
  const validateIDNumber = (id, role) => {
    if (role.includes("Police")) {
      // Manila Police District ID format: MPD-XXXXX
      return /^MPD-\d{5}$/.test(id);
    } else if (role.includes("Barangay")) {
      // Manila Barangay ID format: BRGY-XXXXX
      return /^BRGY-\d{5}$/.test(id);
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate selected role
      if (!selectedRole) {
        setError("Please select a role");
        setLoading(false);
        return;
      }

      // Format the role for backend
      const formattedRole = formatRoleForBackend(selectedRole);
      console.log('Using role format for Motoko backend:', formattedRole);

      if (isRegistering) {
        // Extract the department or barangay based on role
        const departments = selectedRole.includes("Police") && formData.department ? [formData.department] : [];
        const barangays = selectedRole.includes("Barangay") && formData.barangay ? [formData.barangay] : [];

        // Validation
        if (!formData.name) {
          setError("Please enter your name");
          setLoading(false);
          return;
        }

        if (!formData.email) {
          setError("Please enter your email");
          setLoading(false);
          return;
        }

        if (!formData.phoneNumber) {
          setError("Please enter your phone number");
          setLoading(false);
          return;
        }

        if (!validatePhoneNumber(formData.phoneNumber)) {
          setError("Please enter a valid Philippine mobile number (09XX XXX XXXX)");
          setLoading(false);
          return;
        }

        if (!formData.password) {
          setError("Please create a password");
          setLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        if (selectedRole.includes("Police") || selectedRole.includes("Barangay")) {
          if (!formData.idNumber) {
            setError(`Please enter your ${selectedRole.includes("Police") ? "Police" : "Barangay"} ID number`);
            setLoading(false);
            return;
          }

          if (!validateIDNumber(formData.idNumber, selectedRole)) {
            setError(`Please enter a valid ${selectedRole.includes("Police") ? "Police" : "Barangay"} ID number (${selectedRole.includes("Police") ? "MPD-XXXXX" : "BRGY-XXXXX"})`);
            setLoading(false);
            return;
          }
        }

        if (selectedRole.includes("Police") && !formData.department) {
          setError("Please select a police station");
          setLoading(false);
          return;
        }

        if (selectedRole.includes("Barangay") && !formData.barangay) {
          setError("Please select a barangay");
          setLoading(false);
          return;
        }

        // Use the register function from AuthContext with the string variant name
        const result = await register(
          formData.name,
          formData.email,
          formData.password,
          formattedRole,
          departments,
          barangays,
          formData.phoneNumber,
          formData.idNumber
        );

        if (result.success) {
          console.log('Registration successful:', result.user);
          navigate("/dashboard");
        } else {
          setError(result.error || "Registration failed");
        }
      } else {
        // Login validation
        if (!formData.email) {
          setError("Please enter your email");
          setLoading(false);
          return;
        }

        if (!formData.password) {
          setError("Please enter your password");
          setLoading(false);
          return;
        }

        // Login using AuthContext's login function with the string variant name
        const result = await login(
          selectedRole === "Citizen" ? formData.email : formData.idNumber,
          formData.password,
          formattedRole
        );
        
        if (result.success) {
          console.log('Login successful:', result.user);
          navigate("/dashboard");
        } else {
          setError(result.error || "Invalid credentials");
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
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

  // Documentation function
  const handleDocumentation = () => {
    window.open("/docs", "_blank")
  }

  // API function
  const handleAPI = () => {
    window.open("/api-docs", "_blank")
  }

  const platformFeatures = [
    { icon: Monitor, title: "Web Portal for Officials", desc: "React.js + Next.js", color: "text-blue-600" },
    { icon: Lock, title: "zkLogin & Internet Identity", desc: "Anonymous & Verified Access", color: "text-green-600" },
    { icon: Network, title: "Built on Internet Computer", desc: "Decentralized & Immutable", color: "text-orange-600" },
    { icon: Smartphone, title: "Mobile App (Coming Soon)", desc: "Native Mobile Experience", color: "text-purple-600" },
  ]

  const coreFeatures = [
    { icon: FileText, title: "Rich Reporting System", desc: "Tag issues, upload media, track status" },
    { icon: Vote, title: "DAO Governance", desc: "Community proposals and transparent voting" },
    { icon: MapPin, title: "Location Intelligence", desc: "Mapbox integration with hotspot analytics" },
    { icon: Award, title: "Reputation System", desc: "Earn tokens and badges for contributions" },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time insights and transparency" },
    { icon: Bell, title: "Smart Notifications", desc: "Updates on reports and community activities" },
  ]

  const stats = [
    { number: "15,000+", label: "Active Citizens", icon: Users, color: "from-purple-500 to-purple-600" },
    { number: "1,200+", label: "Reports Resolved", icon: CheckCircle, color: "from-green-500 to-green-600" },
    { number: "70+", label: "Barangays Connected", icon: Building, color: "from-blue-500 to-blue-600" },
    { number: "99.9%", label: "Platform Uptime", icon: Shield, color: "from-orange-500 to-orange-600" },
  ]

  const techStack = [
    { category: "Frontend", items: ["Kotlin + Jetpack Compose", "React.js + Next.js", "Tailwind CSS"] },
    { category: "Backend", items: ["Motoko Smart Contracts", "ICP Canisters", "Asset Storage"] },
    { category: "Auth", items: ["Internet Identity", "zkLogin", "Role-Based Access"] },
    { category: "Integration", items: ["Mapbox API", "Oracle Services", "SNS Governance"] },
  ]

  // If no role is selected, show the landing page
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

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="relative z-10">
          {/* Enhanced Navigation */}
          <nav className="flex justify-between items-center p-6 lg:p-8">
            <Logo size="md" className="text-white" inHomePage={true} />
            <div className="flex items-center gap-6">
              <button
                onClick={handleDocumentation}
                className="text-white/80 hover:text-white transition-colors font-medium flex items-center gap-2"
              >
                <Book className="w-4 h-4" />
                Documentation
              </button>
              <button
                onClick={handleAPI}
                className="text-white/80 hover:text-white transition-colors font-medium flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                API
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl hover:bg-white/20 transition-all border border-white/20 font-medium">
                Get Help
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20">
            {/* Trust Badge */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl px-8 py-4 mb-8">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <span className="text-blue-200 font-semibold">Trusted by 15,000+ Manila Citizens</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              {/* Main Headline */}
              <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-tight">
                <span className="block text-white">CivicChain</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Governance
                </span>
                <span className="block text-5xl lg:text-6xl text-white">Revolution</span>
              </h1>

              <p className="text-2xl lg:text-3xl text-blue-100 max-w-5xl mx-auto mb-6 leading-relaxed font-light">
                Decentralized civic coordination, transparency, and reporting system
              </p>
              <p className="text-xl text-blue-200 max-w-4xl mx-auto mb-12 leading-relaxed">
                Connecting citizens, barangays, and law enforcement under one transparent network powered by Internet
                Computer Protocol
              </p>

              {/* Platform Features */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
                {platformFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <Icon className={`w-10 h-10 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                      <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-blue-200 text-sm">{feature.desc}</p>
                    </div>
                  )
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                <button
                  onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: "smooth" })}
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-2xl"
                >
                  <span className="flex items-center justify-center gap-3">
                    Start Your Journey
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all border border-white/20">
                  <span className="flex items-center justify-center gap-3">
                    <Globe className="w-6 h-6" />
                    Explore Platform
                  </span>
                </button>
              </div>

              {/* Stats Dashboard */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="relative group">
                      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all group-hover:scale-105">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                        <div className="text-blue-200 font-medium">{stat.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Core Features Section */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-6">Platform Capabilities</h2>
                <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                  Comprehensive tools for modern civic engagement and transparent governance
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                {coreFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="group relative">
                      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all h-full">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-blue-200 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mobile App Coming Soon */}
            <div className="mb-20">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">Mobile App Coming Soon</h2>
                <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                  We're developing a native mobile experience to make civic engagement even more accessible.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4">Native Mobile Experience</h3>
                    <p className="text-blue-200 leading-relaxed mb-6">
                      Our upcoming mobile app will provide a seamless experience for citizens to report issues,
                      participate in community governance, and stay updated on local announcements - all from your
                      smartphone.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                        Real-time Notifications
                      </span>
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">Camera Integration</span>
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">Location Services</span>
                      <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">Offline Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="mb-20">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-6">Built with Modern Tech</h2>
                <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                  Cutting-edge technology stack ensuring security, scalability, and performance
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">{tech.category}</h3>
                    <ul className="space-y-3">
                      {tech.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-3 text-blue-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Selection */}
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">Choose Your Access Portal</h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-4">
                Select your role to access the appropriate dashboard and start making a difference
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl px-6 py-3">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200 text-sm font-medium">Secure role-based authentication</span>
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
                        <span className="text-lg font-bold mr-3">Access Portal</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-2">
                  <Logo size="lg" className="mb-6" />
                  <p className="text-blue-200 mb-6 text-lg leading-relaxed">
                    Building the future of civic engagement through blockchain technology, community participation, and
                    transparent governance.
                  </p>
                  <div className="flex gap-4">
                    {["Facebook", "Twitter", "LinkedIn", "GitHub"].map((social, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer group"
                      >
                        <span className="text-white font-bold group-hover:scale-110 transition-transform">
                          {social[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-bold text-lg mb-6">Platform</h4>
                  <ul className="space-y-4 text-blue-200">
                    {["Mobile App", "Web Portal", "API Access", "Documentation", "Security"].map((item, index) => (
                      <li key={index}>
                        <a href="#" className="hover:text-white transition-colors font-medium">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold text-lg mb-6">Governance</h4>
                  <ul className="space-y-4 text-blue-200">
                    {["DAO Governance", "Proposals", "Voting", "Forums", "Events"].map((item, index) => (
                      <li key={index}>
                        <a href="#" className="hover:text-white transition-colors font-medium">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold text-lg mb-6">Support</h4>
                  <ul className="space-y-4 text-blue-200">
                    {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Status"].map(
                      (item, index) => (
                        <li key={index}>
                          <a href="#" className="hover:text-white transition-colors font-medium">
                            {item}
                          </a>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-blue-200 mb-4 md:mb-0">
                  &copy; 2024 CivicChain. All rights reserved. Built on Internet Computer Protocol.
                </p>
                <div className="flex items-center gap-6 text-blue-200">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    All systems operational
                  </span>
                  <span>Version 2.1.0</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }

  // If a role is selected, show the login/register form
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
            {userRoles.find((r) => r.value === selectedRole)?.label}
          </h2>
          <p className="text-gray-600">
            {isRegistering ? "Create your account to get started" : "Welcome back! Please sign in"}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="09XX XXX XXXX"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">Format: 09XX XXX XXXX</p>
                </div>

                {(selectedRole.includes("Police") || selectedRole.includes("Barangay")) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedRole.includes("Police") ? "Police ID Number" : "Barangay ID Number"}
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={selectedRole.includes("Police") ? "MPD-XXXXX" : "BRGY-XXXXX"}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Format: {selectedRole.includes("Police") ? "MPD-XXXXX" : "BRGY-XXXXX"}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Create a strong password"
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

                {selectedRole.includes("Police") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Police Station</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
                    <select
                      name="barangay"
                      value={formData.barangay}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedRole.includes("Police") ? "Police ID Number" : "Barangay ID Number"}
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={`Enter your ${selectedRole.includes("Police") ? "Police" : "Barangay"} ID number`}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
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
              </>
            )}

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
              {loading ? "Processing..." : isRegistering ? "Create Account" : "Sign In"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setSelectedRole("")}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← Back to role selection
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Export Home component directly
export default Home;
