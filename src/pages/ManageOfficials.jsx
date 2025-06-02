"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from "../contexts/AuthContext"
import { getActor } from "../utils/icp"
import { Users, Plus, Edit, Trash2, Shield, Mail, Search } from "lucide-react"

const ManageOfficials = () => {
  const { user } = useAuth()
  const [officials, setOfficials] = useState([])
  const [filteredOfficials, setFilteredOfficials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [newOfficial, setNewOfficial] = useState({
    name: "",
    email: "",
    role: "BarangayOfficial",
    department: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    loadOfficials()
  }, [])

  useEffect(() => {
    filterOfficials()
  }, [officials, searchTerm, roleFilter])

  const loadOfficials = async () => {
    try {
      const actor = await getActor()
      const result = await actor.getAllOfficials()
      setOfficials(result)
    } catch (error) {
      console.error("Error loading officials:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterOfficials = () => {
    let filtered = officials

    if (searchTerm) {
      filtered = filtered.filter(
        (official) =>
          official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          official.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter) {
      filtered = filtered.filter((official) => Object.keys(official.role)[0] === roleFilter)
    }

    setFilteredOfficials(filtered)
  }

  const handleAddOfficial = async (e) => {
    e.preventDefault()
    try {
      const actor = await getActor()
      const result = await actor.registerUser(
        newOfficial.name,
        newOfficial.email,
        { [newOfficial.role]: null },
        newOfficial.department ? [newOfficial.department] : [],
        [user.barangay],
      )

      if ("ok" in result) {
        setShowAddForm(false)
        setNewOfficial({
          name: "",
          email: "",
          role: "BarangayOfficial",
          department: "",
          phone: "",
          address: "",
        })
        loadOfficials()
      } else {
        alert("Error adding official: " + result.err)
      }
    } catch (error) {
      console.error("Error adding official:", error)
      alert("Error adding official")
    }
  }

  const handleRemoveOfficial = async (officialId) => {
    if (confirm("Are you sure you want to remove this official?")) {
      try {
        // In a real implementation, you would have a removeUser function
        alert("Remove functionality would be implemented here")
      } catch (error) {
        console.error("Error removing official:", error)
      }
    }
  }

  const handleAssignRole = async (officialId, newRole) => {
    try {
      const actor = await getActor()
      const result = await actor.assignRole(officialId, newRole)
      if ('ok' in result) {
        loadOfficials()
      } else {
        alert('Error assigning role: ' + result.err)
      }
    } catch (error) {
      console.error('Error assigning role:', error)
      alert('Error assigning role')
    }
  }

  const getRoleColor = (role) => {
    const roleKey = Object.keys(role)[0]
    switch (roleKey) {
      case "HeadBarangay":
        return "bg-purple-100 text-purple-800"
      case "BarangayOfficial":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString()
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Officials</h1>
          <p className="text-gray-600 mt-2">Manage barangay officials for {user.barangay}</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Official
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Officials</p>
              <p className="text-2xl font-bold text-gray-900">{officials.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Officials</p>
              <p className="text-2xl font-bold text-green-600">{officials.filter((o) => o.isActive).length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-purple-600">2</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-purple-600" />
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
              placeholder="Search officials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="BarangayOfficial">Barangay Official</option>
            <option value="HeadBarangay">Head Barangay</option>
          </select>
        </div>
      </div>

      {/* Officials List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Officials List</h3>
        </div>

        {filteredOfficials.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No officials found</h3>
            <p className="text-gray-500">
              {searchTerm || roleFilter ? "Try adjusting your filters" : "No officials have been added yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Official
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOfficials.map((official) => (
                  <tr key={official.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {official.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{official.name}</div>
                          <div className="text-sm text-gray-500">{official.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(official.role)}`}
                      >
                        {Object.keys(official.role)[0]
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {official.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          official.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {official.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveOfficial(official.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Official Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Official</h2>
            <form onSubmit={handleAddOfficial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newOfficial.name}
                  onChange={(e) => setNewOfficial({ ...newOfficial, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newOfficial.email}
                  onChange={(e) => setNewOfficial({ ...newOfficial, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newOfficial.role}
                  onChange={(e) => setNewOfficial({ ...newOfficial, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BarangayOfficial">Barangay Official</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={newOfficial.department}
                  onChange={(e) => setNewOfficial({ ...newOfficial, department: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Health, Education, Public Works"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Add Official
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageOfficials
