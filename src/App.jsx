import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import SubmitReport from './pages/SubmitReport';
import Proposals from './pages/Proposals';
import Announcements from './pages/Announcements';
import Analytics from './pages/Analytics';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/submit-report"
        element={
          <ProtectedRoute allowedRoles={['Citizen']}>
            <Layout>
              <SubmitReport />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Placeholder routes for other pages */}
      <Route
        path="/proposals"
        element={
          <ProtectedRoute>
            <Layout>
              <Proposals />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <Layout>
              <Announcements />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/assignments"
        element={
          <ProtectedRoute allowedRoles={['Police', 'HeadPolice']}>
            <Layout>
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Assignments</h2>
                <p className="text-gray-600">Assignment management coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/barangay-reports"
        element={
          <ProtectedRoute allowedRoles={['BarangayOfficial', 'HeadBarangay']}>
            <Layout>
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Barangay Reports</h2>
                <p className="text-gray-600">Barangay-specific reports coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['HeadPolice', 'HeadBarangay']}>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/create-proposal"
        element={
          <ProtectedRoute allowedRoles={['HeadBarangay']}>
            <Layout>
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Create Proposal</h2>
                <p className="text-gray-600">Proposal creation coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/create-announcement"
        element={
          <ProtectedRoute allowedRoles={['HeadPolice', 'HeadBarangay']}>
            <Layout>
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
                <p className="text-gray-600">Announcement creation coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/manage-police"
        element={
          <ProtectedRoute allowedRoles={['HeadPolice']}>
            <Layout>
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Manage Police</h2>
                <p className="text-gray-600">Police management coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/manage-officials"
        element={
          <ProtectedRoute allowedRoles={['HeadBarangay']}>
            <Layout>
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Manage Officials</h2>
                <p className="text-gray-600">Official management coming soon...</p>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;