"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from "../contexts/AuthContext"
import { getActor } from "../utils/icp"
import { FileText, MapPin, Calendar, User, Eye, Search, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

const BarangayReports = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inProgress: 0,
    resolved: 0,
  })

  useEffect(() => {
    loadBarangayReports()
  }, [])

  useEffect(() => {
    filterReports()
  }, [reports, searchTerm, statusFilter])

  const loadBarangayReports = async () => {
    try {
      const actor = await getActor()
      const result = await actor.getReportsByBarangay(user.barangay)
      setReports(result)

      // Calculate stats
      const statsData = await actor.getReportStatsByBarangay(user.barangay)
      setStats(statsData)
    } catch (error) {
      console.error("Error loading barangay reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterReports = () => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((report) => Object.keys(report.status)[0] === statusFilter)
    }

    setFilteredReports(filtered)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-yellow-100 text-yellow-800"
      case "UnderReview":
        return "bg-purple-100 text-purple-800"
      case "InProgress":
        return "bg-blue-100 text-blue-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Escalated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString()
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setShowModal(true)
  }

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const actor = await getActor()
      const result = await actor.updateReportStatus(reportId, newStatus)
      if ('ok' in result) {
        loadBarangayReports()
        setShowModal(false)
      } else {
        alert('Error updating report status: ' + result.err)
      }
    } catch (error) {
      console.error('Error updating report status:', error)
      alert('Error updating report status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Barangay Reports</h1>
          <p className="text-gray-600 mt-2">Manage reports from {user.barangay}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.submitted}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="UnderReview">Under Review</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter ? "Try adjusting your filters" : "No reports have been submitted yet"}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const statusKey = Object.keys(report.status)[0]
            return (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(statusKey)}`}
                      >
                        {statusKey.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {report.location.address}
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
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Report Detail Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedReport.title}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(Object.keys(selectedReport.status)[0])}`}
                  >
                    {Object.keys(selectedReport.status)[0]
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedReport.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">{selectedReport.location.address}</p>
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

                {/* Management Actions */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(selectedReport.status)[0] === "Submitted" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, { UnderReview: null })}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                      >
                        Mark Under Review
                      </button>
                    )}

                    {Object.keys(selectedReport.status)[0] === "UnderReview" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, { InProgress: null })}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Start Working
                      </button>
                    )}

                    {Object.keys(selectedReport.status)[0] === "InProgress" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, { Resolved: null })}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Mark Resolved
                      </button>
                    )}

                    {Object.keys(selectedReport.status)[0] !== "Escalated" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, { Escalated: null })}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                      >
                        Escalate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BarangayReports
