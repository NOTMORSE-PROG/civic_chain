import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { civicchainActor } from '../utils/icp';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReports: 0,
    totalUsers: 0,
    totalProposals: 0,
    totalAnnouncements: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [systemInfo, reports, announcements] = await Promise.all([
        civicchainActor.getSystemInfo(),
        civicchainActor.getAllReports(),
        civicchainActor.getAllAnnouncements()
      ]);

      setStats(systemInfo);
      setRecentReports(reports.slice(-5).reverse());
      setRecentAnnouncements(announcements.slice(-3).reverse());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'text-yellow-600 bg-yellow-100';
      case 'UnderReview': return 'text-purple-600 bg-purple-100';
      case 'InProgress': return 'text-blue-600 bg-blue-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      case 'Escalated': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user.name}!`;
  };

  const getDashboardCards = () => {
    const baseCards = [
      {
        title: 'Total Reports',
        value: stats.totalReports,
        icon: FileText,
        color: 'bg-blue-500',
        change: '+12%'
      },
      {
        title: 'Active Users',
        value: stats.totalUsers,
        icon: Users,
        color: 'bg-green-500',
        change: '+8%'
      },
      {
        title: 'Proposals',
        value: stats.totalProposals,
        icon: CheckCircle,
        color: 'bg-purple-500',
        change: '+5%'
      },
      {
        title: 'Announcements',
        value: stats.totalAnnouncements,
        icon: AlertTriangle,
        color: 'bg-orange-500',
        change: '+3%'
      }
    ];

    return baseCards;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-civic-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-civic-blue to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{getWelcomeMessage()}</h1>
        <p className="text-blue-100">
          Welcome to your {user.role.replace(/([A-Z])/g, ' $1').trim()} dashboard. 
          {user.barangay && ` Managing ${user.barangay}.`}
          {user.department && ` Serving at ${user.department}.`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getDashboardCards().map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {card.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          
          {recentReports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reports yet</p>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {report.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(Object.keys(report.status)[0])}`}>
                        {Object.keys(report.status)[0].replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {report.location.barangay}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(report.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Announcements</h3>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          
          {recentAnnouncements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No announcements yet</p>
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {announcement.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      Target: {Object.keys(announcement.targetAudience)[0]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(announcement.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {user.role === 'Citizen' && (
            <>
              <button className="p-4 bg-civic-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Submit Report</span>
              </button>
              <button className="p-4 bg-civic-green text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">View Proposals</span>
              </button>
            </>
          )}
          
          {(user.role === 'Police' || user.role === 'HeadPolice') && (
            <>
              <button className="p-4 bg-civic-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Clock className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Pending Cases</span>
              </button>
              <button className="p-4 bg-civic-green text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Resolved Cases</span>
              </button>
            </>
          )}
          
          {(user.role === 'BarangayOfficial' || user.role === 'HeadBarangay') && (
            <>
              <button className="p-4 bg-civic-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                <MapPin className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Barangay Reports</span>
              </button>
              <button className="p-4 bg-civic-green text-white rounded-lg hover:bg-green-700 transition-colors">
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Community</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;