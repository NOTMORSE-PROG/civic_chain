import { Shield, Building2 } from "lucide-react"

const Logo = ({ size = "md", showText = true, className = "", inHomePage = false }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Main logo container with gradient background */}
        <div
          className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>

          {/* Main shield icon */}
          <Shield
            className={`${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : size === "lg" ? "w-8 h-8" : "w-10 h-10"} text-white relative z-10`}
          />

          {/* Small building icon overlay */}
          <Building2
            className={`${size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-5 h-5"} text-blue-200 absolute bottom-1 right-1 z-10`}
          />
        </div>

        {/* Decorative ring */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-blue-200 rounded-xl animate-pulse`}
        ></div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1
            className={`${textSizeClasses[size]} font-bold ${inHomePage ? "text-white" : "text-gray-900"} leading-tight`}
          >
            CivicChain
          </h1>
          <p
            className={`${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"} ${inHomePage ? "text-white" : "text-blue-600"} font-medium -mt-1`}
          >
            Manila
          </p>
        </div>
      )}
    </div>
  )
}

export default Logo
