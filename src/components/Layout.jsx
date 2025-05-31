import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Shield, 
  Building,
  Vote,
  Megaphone,
  BarChart3
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/reports', icon: FileText, label: 'Reports' },
    ];

    switch (user.role) {
      case 'Citizen':
        return [
          ...baseItems,
          { path: '/submit-report', icon: FileText, label: 'Submit Report' },
          { path: '/proposals', icon: Vote, label: 'Proposals' },
          { path: '/announcements', icon: Megaphone, label: 'Announcements' },
        ];
      
      case 'Police':
        return [
          ...baseItems,
          { path: '/assignments', icon: Shield, label: 'My Assignments' },
          { path: '/announcements', icon: Megaphone, label: 'Announcements' },
        ];
      
      case 'HeadPolice':
        return [
          ...baseItems,
          { path: '/assignments', icon: Shield, label: 'Assignments' },
          { path: '/manage-police', icon: Users, label: 'Manage Police' },
          { path: '/create-announcement', icon: Megaphone, label: 'Create Announcement' },
          { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        ];
      
      case 'BarangayOfficial':
        return [
          ...baseItems,
          { path: '/barangay-reports', icon: FileText, label: 'Barangay Reports' },
          { path: '/proposals', icon: Vote, label: 'Proposals' },
          { path: '/announcements', icon: Megaphone, label: 'Announcements' },
        ];
      
      case 'HeadBarangay':
        return [
          ...baseItems,
          { path: '/barangay-reports', icon: FileText, label: 'Barangay Reports' },
          { path: '/manage-officials', icon: Users, label: 'Manage Officials' },
          { path: '/create-proposal', icon: Vote, label: 'Create Proposal' },
          { path: '/create-announcement', icon: Megaphone, label: 'Create Announcement' },
          { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-civic-blue">CivicChain</h1>
          <p className="text-sm text-gray-600 mt-1">Manila Governance Platform</p>
        </div>
        
        <nav className="mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-civic-blue text-white border-r-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-civic-blue rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {navigationItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;