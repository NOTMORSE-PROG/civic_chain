"use client"

import React, { useState } from 'react'
import { useAuth } from "../contexts/AuthContext"
import { getActor } from "../utils/icp"
import { Plus, FileText, DollarSign, Calendar, Users, Target, AlertTriangle, CheckCircle } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const CreateProposal = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Infrastructure",
    priority: "Medium",
    budget: "",
    timeline: "",
    beneficiaries: "",
    objectives: "",
    implementation: "",
    risks: "",
    successMetrics: "",
    deadline: "",
  })

  const categories = [
    { value: "Infrastructure", label: "Infrastructure Development", icon: "🏗️" },
    { value: "PublicSafety", label: "Public Safety & Security", icon: "🛡️" },
    { value: "Environment", label: "Environmental Protection", icon: "🌱" },
    { value: "Education", label: "Education & Training", icon: "📚" },
    { value: "Health", label: "Health & Wellness", icon: "🏥" },
    { value: "Transportation", label: "Transportation & Mobility", icon: "🚌" },
    { value: "Technology", label: "Digital Innovation", icon: "💻" },
    { value: "CommunityDevelopment", label: "Community Development", icon: "🏘️" },
  ]

  const priorities = [
    { value: "Low", label: "Low Priority", color: "text-gray-600 bg-gray-100" },
    { value: "Medium", label: "Medium Priority", color: "text-blue-600 bg-blue-100" },
    { value: "High", label: "High Priority", color: "text-orange-600 bg-orange-100" },
    { value: "Critical", label: "Critical Priority", color: "text-red-600 bg-red-100" },
  ]

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const actor = await getActor()
      const deadlineTimestamp = formData.deadline
        ? new Date(formData.deadline).getTime() * 1000000
        : Date.now() + 30 * 24 * 60 * 60 * 1000 * 1000000 // 30 days from now

      const result = await actor.createProposal(
        formData.title,
        formData.description,
        formData.category,
        user.barangay,
        user.id,
        Number.parseInt(formData.budget) || 0,
        deadlineTimestamp,
      )

      if ("ok" in result) {
        navigate('/proposals')
      } else {
        setError(result.err)
      }
    } catch (error) {
      console.error("Error creating proposal:", error)
      setError("An error occurred while creating the proposal")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md text-center p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your proposal has been submitted and is now available for community voting. Citizens can view and vote on
            your proposal through the platform.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Another Proposal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Community Proposal</h1>
          <p className="text-gray-600">Submit a formal proposal for community consideration and democratic voting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Proposal Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a clear, descriptive title for your proposal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Estimated Budget (PHP) *
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Voting Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Detailed Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Proposal Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide a comprehensive description of your proposal, including background and rationale"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Objectives & Goals</label>
                <textarea
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List the specific objectives and expected outcomes"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Target Beneficiaries
                </label>
                <textarea
                  name="beneficiaries"
                  value={formData.beneficiaries}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Who will benefit from this proposal? (e.g., residents, businesses, students)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Implementation Plan</label>
                <textarea
                  name="implementation"
                  value={formData.implementation}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe how this proposal will be implemented, including key steps and milestones"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Potential Risks & Mitigation
                  </label>
                  <textarea
                    name="risks"
                    value={formData.risks}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Identify potential risks and how they will be addressed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Success Metrics</label>
                  <textarea
                    name="successMetrics"
                    value={formData.successMetrics}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How will success be measured? Define key performance indicators"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
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
              <Plus className="w-4 h-4" />
              {loading ? "Creating..." : "Create Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProposal
