import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  BarChart3,
  Bell,
  Menu,
  X,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Officials', href: '/officials', icon: Users },
  { name: 'Announcements', href: '/announcements', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">CivicChain</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">CivicChain</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* User menu */}
              <div className="flex justify-end mb-4">
                <div className="relative">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">{user?.name}</span>
                    <Link
                      to="/profile"
                      className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <User className="h-6 w-6" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <LogOut className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Page content */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;