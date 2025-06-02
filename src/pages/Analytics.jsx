import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getActor, manilaBarangays } from '../utils/icp';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState('');
  const [loading, setLoading] = useState(true);
  const [barangayStats, setBarangayStats] = useState(null);

  useEffect(() => {
    loadSystemAnalytics();
  }, []);

  useEffect(() => {
    if (selectedBarangay) {
      loadBarangayStats();
    }
  }, [selectedBarangay]);

  const loadSystemAnalytics = async () => {
    try {
      const actor = await getActor();
      const result = await actor.getSystemInfo();
      setAnalytics(result);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBarangayStats = async () => {
    if (!selectedBarangay) return;
    
    try {
      const actor = await getActor();
      const result = await actor.getReportStatsByBarangay(selectedBarangay);
      setBarangayStats(result);
    } catch (error) {
      console.error('Error loading barangay stats:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = null }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, total, color = 'blue' }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>{value} ({percentage.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">System-wide statistics and insights</p>
      </div>

      {/* System Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Reports"
            value={analytics.totalReports}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={analytics.totalUsers}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Active Proposals"
            value={analytics.totalProposals}
            icon={BarChart3}
            color="purple"
          />
          <StatCard
            title="Announcements"
            value={analytics.totalAnnouncements}
            icon={AlertTriangle}
            color="orange"
          />
        </div>
      )}

      {/* Barangay Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Barangay Analytics
          </h2>
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Barangay</option>
            {manilaBarangays.map(barangay => (
              <option key={barangay.number} value={barangay.name}>
                Barangay {barangay.number} - {barangay.name}
              </option>
            ))}
          </select>
        </div>

        {barangayStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Report Statistics</h3>
              <div className="space-y-4">
                <StatCard
                  title="Total Reports"
                  value={barangayStats.total}
                  icon={FileText}
                  color="blue"
                />
                <ProgressBar
                  label="Submitted"
                  value={barangayStats.submitted}
                  total={barangayStats.total}
                  color="yellow"
                />
                <ProgressBar
                  label="In Progress"
                  value={barangayStats.inProgress}
                  total={barangayStats.total}
                  color="blue"
                />
                <ProgressBar
                  label="Resolved"
                  value={barangayStats.resolved}
                  total={barangayStats.total}
                  color="green"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resolution Rate</span>
                    <span className="text-lg font-semibold text-green-600">
                      {barangayStats.total > 0 
                        ? ((barangayStats.resolved / barangayStats.total) * 100).toFixed(1)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Cases</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {barangayStats.submitted + barangayStats.inProgress}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <span className="text-lg font-semibold text-yellow-600">
                      {barangayStats.submitted}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedBarangay ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading barangay statistics...</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Select a barangay to view detailed analytics</p>
          </div>
        )}
      </div>

      {/* Quick Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quick Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Most Active Barangay</h3>
            <p className="text-sm text-blue-700">
              Based on report submissions and community engagement
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Best Resolution Rate</h3>
            <p className="text-sm text-green-700">
              Barangays with highest case resolution efficiency
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">Community Participation</h3>
            <p className="text-sm text-purple-700">
              DAO proposal voting and civic engagement metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;