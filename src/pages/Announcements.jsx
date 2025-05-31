import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { civicchainActor } from '../utils/icp';
import { 
  Plus, 
  Megaphone, 
  Calendar, 
  User, 
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'General',
    priority: 'Medium'
  });

  const announcementTypes = [
    'General',
    'Emergency',
    'Public Safety',
    'Community Event',
    'Service Update',
    'Traffic Advisory',
    'Weather Alert'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const result = await civicchainActor.getAllAnnouncements();
      setAnnouncements(result);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const result = await civicchainActor.createAnnouncement(
        newAnnouncement.title,
        newAnnouncement.content,
        newAnnouncement.type,
        newAnnouncement.priority,
        user.id
      );
      
      if ('ok' in result) {
        setShowCreateForm(false);
        setNewAnnouncement({ title: '', content: '', type: 'General', priority: 'Medium' });
        loadAnnouncements();
      } else {
        alert('Error creating announcement: ' + result.err);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Error creating announcement');
    }
  };

  const canCreateAnnouncement = () => {
    return user.role === 'Police' || user.role === 'HeadPolice' || 
           user.role === 'BarangayOfficial' || user.role === 'HeadBarangay';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'High':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'Medium':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Official announcements and updates</p>
        </div>
        {canCreateAnnouncement() && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Announcement
          </button>
        )}
      </div>

      {/* Create Announcement Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Announcement</h2>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {announcementTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Announcement
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

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
            <p className="text-gray-600">
              {canCreateAnnouncement() 
                ? "Create the first announcement for your community."
                : "Check back later for official announcements."
              }
            </p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                announcement.priority === 'Critical' ? 'border-red-500' :
                announcement.priority === 'High' ? 'border-orange-500' :
                announcement.priority === 'Medium' ? 'border-blue-500' :
                'border-green-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getPriorityIcon(announcement.priority)}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(Number(announcement.createdAt) / 1000000).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {announcement.authorId}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {announcement.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;