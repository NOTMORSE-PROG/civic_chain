"use client"

import React, { useState } from 'react'
import { useAuth } from "../contexts/AuthContext"
import { getActor } from "../utils/icp"
import { useNavigate } from 'react-router-dom'
import { Megaphone, Send, AlertCircle, Info, CheckCircle, Users, MapPin } from "lucide-react"

const CreateAnnouncement = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "General",
    priority: "Medium",
    targetAudience: "All",
    expiryDate: "",
    isUrgent: false,
  })

  const navigate = useNavigate()

  const announcementTypes = [
    "General",
    "Emergency",
    "Public Safety",
    "Community Event",
    "Service Update",
    "Traffic Advisory",
    "Weather Alert",
    "Health Advisory",
    "Construction Notice",
    "Meeting Notice",
  ]

  const priorities = [
    { value: "Low", label: "Low Priority", color: "text-gray-600 bg-gray-100", icon: Info },
    { value: "Medium", label: "Medium Priority", color: "text-blue-600 bg-blue-100", icon: Info },
    { value: "High", label: "High Priority", color: "text-orange-600 bg-orange-100", icon: AlertCircle },
    { value: "Critical", label: "Critical Priority", color: "text-red-600 bg-red-100", icon: AlertCircle },
  ]

  const targetAudiences = [
    { value: "All", label: "All Citizens", icon: Users },
    { value: "Barangay", label: `${user.barangay} Residents Only`, icon: MapPin },
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const actor = await getActor()
      const result = await actor.createAnnouncement(
        formData.title,
        formData.content,
        formData.type,
        formData.priority,
        user.id
      )
      
      if ('ok' in result) {
        navigate('/announcements')
      } else {
        setError(result.err)
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      setError('An error occurred while creating the announcement')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityIcon = (priority) => {
    const config = priorities.find((p) => p.value === priority)
    return config ? config.icon : Info
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md text-center p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Announcement Published!</h2>
          <p className="text-gray-600 mb-6">
            Your announcement has been published and is now visible to the selected audience. Citizens will receive
            notifications based on their preferences.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Another Announcement
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-blue-600" />
            Create Announcement
          </h1>
          <p className="text-gray-600">Communicate important information to your community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Announcement Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a clear, attention-grabbing title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {announcementTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {targetAudiences.map((audience) => (
                  <option key={audience.value} value={audience.value}>
                    {audience.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date (Optional)</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Announcement Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your announcement content here. Be clear and concise while providing all necessary information."
              required
            />
            <p className="text-sm text-gray-500 mt-1">{formData.content.length}/1000 characters</p>
          </div>

          {/* Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Options</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isUrgent"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="isUrgent" className="ml-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Mark as Urgent (sends immediate notifications)
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Preview</h3>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">{formData.title || "Announcement Title"}</h4>
                <div className="flex items-center gap-2">
                  {formData.isUrgent && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">URGENT</span>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      priorities.find((p) => p.value === formData.priority)?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {formData.priority}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                {formData.content || "Your announcement content will appear here..."}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Type: {formData.type}</span>
                <span>Audience: {targetAudiences.find((a) => a.value === formData.targetAudience)?.label}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? "Publishing..." : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAnnouncement
