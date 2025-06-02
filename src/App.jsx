"use client"
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import SubmitReport from './pages/SubmitReport';
import Proposals from './pages/Proposals';
import Announcements from './pages/Announcements';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import BarangayReports from './pages/BarangayReports';
import ManageOfficials from './pages/ManageOfficials';
import CreateProposal from './pages/CreateProposal';
import CreateAnnouncement from './pages/CreateAnnouncement';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-white/80 mb-6">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => {
                localStorage.removeItem('civicchain_user');
                window.location.reload();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Layout>{children}</Layout>;
};

// App Routes Component
const AppRoutes = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public route: Home handles all login/register UI */}
      <Route path="/" element={<Home />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements/create"
        element={
          <ProtectedRoute>
            <CreateAnnouncement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officials"
        element={
          <ProtectedRoute>
            <ManageOfficials />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposals"
        element={
          <ProtectedRoute>
            <Proposals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposals/create"
        element={
          <ProtectedRoute>
            <CreateProposal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <BarangayReports />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// Root App component with providers
const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
