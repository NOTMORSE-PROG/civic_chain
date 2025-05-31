import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { civicchainActor } from '../utils/icp';
import { 
  Plus, 
  Vote, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users,
  Calendar,
  MapPin
} from 'lucide-react';

const Proposals = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    budget: ''
  });

  const categories = [
    'Infrastructure',
    'Public Safety',
    'Environment',
    'Education',
    'Health',
    'Transportation',
    'Community Development'
  ];

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const result = await civicchainActor.getAllProposals();
      setProposals(result);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      const result = await civicchainActor.createProposal(
        newProposal.title,
        newProposal.description,
        newProposal.category,
        parseInt(newProposal.budget) || 0,
        user.id
      );
      
      if ('ok' in result) {
        setShowCreateForm(false);
        setNewProposal({ title: '', description: '', category: 'Infrastructure', budget: '' });
        loadProposals();
      } else {
        alert('Error creating proposal: ' + result.err);
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Error creating proposal');
    }
  };

  const handleVote = async (proposalId, vote) => {
    try {
      const result = await civicchainActor.voteOnProposal(proposalId, vote, user.id);
      if ('ok' in result) {
        loadProposals();
      } else {
        alert('Error voting: ' + result.err);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error voting on proposal');
    }
  };

  const getVoteCount = (proposal, voteType) => {
    return proposal.votes.filter(([_, vote]) => vote === voteType).length;
  };

  const hasUserVoted = (proposal) => {
    return proposal.votes.some(([userId, _]) => userId === user.id);
  };

  const canCreateProposal = () => {
    return user.role === 'Police' || user.role === 'HeadPolice' || 
           user.role === 'BarangayOfficial' || user.role === 'HeadBarangay';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DAO Proposals</h1>
          <p className="text-gray-600 mt-2">Community governance and decision making</p>
        </div>
        {canCreateProposal() && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Proposal
          </button>
        )}
      </div>

      {/* Create Proposal Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Proposal</h2>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newProposal.category}
                  onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (PHP)
                </label>
                <input
                  type="number"
                  value={newProposal.budget}
                  onChange={(e) => setNewProposal({ ...newProposal, budget: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Proposal
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proposals List */}
      <div className="grid gap-6">
        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-600">
              {canCreateProposal() 
                ? "Be the first to create a proposal for your community."
                : "Check back later for community proposals to vote on."
              }
            </p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {proposal.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{proposal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(Number(proposal.createdAt) / 1000000).toLocaleDateString()}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {proposal.category}
                    </span>
                    {proposal.budget > 0 && (
                      <span className="text-green-600 font-medium">
                        ₱{proposal.budget.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    proposal.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : proposal.status === 'Approved'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
              </div>

              {/* Voting Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">
                        {getVoteCount(proposal, true)} Yes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-medium">
                        {getVoteCount(proposal, false)} No
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {proposal.votes.length} total votes
                      </span>
                    </div>
                  </div>

                  {proposal.status === 'Active' && !hasUserVoted(proposal) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(proposal.id, true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Vote Yes
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, false)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Vote No
                      </button>
                    </div>
                  )}

                  {hasUserVoted(proposal) && (
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                      You have voted
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Proposals;