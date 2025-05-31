import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { civicchainActor, reportStatuses } from '../utils/icp';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  User, 
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter, barangayFilter]);

  const loadReports = async () => {
    try {
      let reportsData;
      
      if (user.role === 'Citizen') {
        // Citizens see all reports
        reportsData = await civicchainActor.getAllReports();
      } else if (user.role.includes('Barangay')) {
        // Barangay officials see reports from their barangay
        reportsData = await civicchainActor.getReportsByBarangay(user.barangay);
      } else {
        // Police see all reports
        reportsData = await civicchainActor.getAllReports();
      }
      
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(report =>
        Object.keys(report.status)[0] === statusFilter
      );
    }

    if (barangayFilter) {
      filtered = filtered.filter(report =>
        report.location.barangay === barangayFilter
      );
    }

    setFilteredReports(filtered);
  };

  const getStatusInfo = (status) => {
    const statusKey = Object.keys(status)[0];
    const statusConfig = reportStatuses.find(s => s.value === statusKey);
    return statusConfig || { label: statusKey, class: 'status-submitted' };
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const getUniqueBarangays = () => {
    const barangays = [...new Set(reports.map(report => report.location.barangay))];
    return barangays.sort();
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const result = await civicchainActor.updateReportStatus(
        reportId,
        { [newStatus]: null },
        user.id
      );
      
      if ('ok' in result) {
        loadReports(); // Reload reports
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const handleAssignReport = async (reportId, assignedTo) => {
    try {
      const result = await civicchainActor.assignReport(reportId, assignedTo, user.id);
      
      if ('ok' in result) {
        loadReports(); // Reload reports
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error assigning report:', error);
    }
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600">
            {user.role === 'Citizen' ? 'Community reports and their status' : 'Manage and track reports'}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredReports.length} reports
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Statuses</option>
            {reportStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={barangayFilter}
            onChange={(e) => setBarangayFilter(e.target.value)}
            className="input-field"
          >
            <option value="">All Barangays</option>
            {getUniqueBarangays().map((barangay) => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter || barangayFilter
                ? 'Try adjusting your filters'
                : 'No reports have been submitted yet'}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const statusInfo = getStatusInfo(report.status);
            
            return (
              <div key={report.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {report.location.barangay}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(report.createdAt)}
                      </div>
                      {!report.isAnonymous && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Reporter ID: {report.submittedBy.slice(-8)}
                        </div>
                      )}
                      {report.assignedTo && (
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Assigned
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="p-2 text-gray-400 hover:text-civic-blue transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {(user.role === 'Police' || user.role === 'HeadPolice' || 
                      user.role === 'BarangayOfficial' || user.role === 'HeadBarangay') && (
                      <button
                        onClick={() => handleViewReport(report)}
                        className="p-2 text-gray-400 hover:text-civic-green transition-colors"
                        title="Manage"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedReport.title}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(selectedReport.status).class}`}>
                    {getStatusInfo(selectedReport.status).label}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedReport.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">{selectedReport.location.address}</p>
                  <p className="text-sm text-gray-500">Barangay: {selectedReport.location.barangay}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Submitted</h4>
                    <p className="text-gray-600">{formatDate(selectedReport.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Last Updated</h4>
                    <p className="text-gray-600">{formatDate(selectedReport.updatedAt)}</p>
                  </div>
                </div>
                
                {selectedReport.mediaUrls.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedReport.mediaUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Management Actions for Officials */}
                {(user.role === 'Police' || user.role === 'HeadPolice' || 
                  user.role === 'BarangayOfficial' || user.role === 'HeadBarangay') && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(selectedReport.status)[0] === 'Submitted' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedReport.id, 'UnderReview')}
                          className="btn-secondary text-sm"
                        >
                          Mark Under Review
                        </button>
                      )}
                      
                      {Object.keys(selectedReport.status)[0] === 'UnderReview' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(selectedReport.id, 'InProgress')}
                            className="btn-primary text-sm"
                          >
                            Start Working
                          </button>
                          <button
                            onClick={() => handleAssignReport(selectedReport.id, user.id)}
                            className="btn-secondary text-sm"
                          >
                            Assign to Me
                          </button>
                        </>
                      )}
                      
                      {Object.keys(selectedReport.status)[0] === 'InProgress' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedReport.id, 'Resolved')}
                          className="btn-primary text-sm"
                        >
                          Mark Resolved
                        </button>
                      )}
                      
                      {Object.keys(selectedReport.status)[0] !== 'Escalated' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedReport.id, 'Escalated')}
                          className="btn-secondary text-sm text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Escalate
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;