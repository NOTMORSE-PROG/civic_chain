import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { civicchainActor, reportTypes } from '../utils/icp';
import GoogleMap from '../components/GoogleMap';
import { MapPin, Upload, Send, Eye, EyeOff } from 'lucide-react';

const SubmitReport = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reportType: '',
    isAnonymous: false,
    mediaUrls: []
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these files to a storage service
    // For now, we'll just store the file names
    const fileUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      mediaUrls: [...prev.mediaUrls, ...fileUrls]
    }));
  };

  const removeMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!location) {
      setError('Please select a location on the map');
      return;
    }

    if (!formData.reportType) {
      setError('Please select a report type');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reportTypeVariant = formData.reportType === 'Other' 
        ? { Other: formData.otherType || 'Other' }
        : { [formData.reportType]: null };

      const result = await civicchainActor.submitReport(
        formData.title,
        formData.description,
        reportTypeVariant,
        location,
        user.id,
        formData.mediaUrls,
        formData.isAnonymous
      );

      if ('ok' in result) {
        setSuccess(true);
        setFormData({
          title: '',
          description: '',
          reportType: '',
          isAnonymous: false,
          mediaUrls: []
        });
        setLocation(null);
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to submit report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your report has been submitted and will be reviewed by the appropriate authorities.
            You will receive updates on the status of your report.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-primary"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit a Report</h2>
          <p className="text-gray-600">
            Help improve your community by reporting issues that need attention.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anonymous Option */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
              className="w-4 h-4 text-civic-blue border-gray-300 rounded focus:ring-civic-blue"
            />
            <label htmlFor="isAnonymous" className="flex items-center text-sm font-medium text-gray-700">
              {formData.isAnonymous ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              Submit anonymously
            </label>
            <span className="text-xs text-gray-500">
              Your identity will be protected
            </span>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type *
            </label>
            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select report type</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {formData.reportType === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specify Other Type
              </label>
              <input
                type="text"
                name="otherType"
                value={formData.otherType || ''}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Please specify the type of issue"
                required
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Brief description of the issue"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="input-field"
              placeholder="Provide detailed information about the issue, including when it occurred and any relevant details"
              required
            />
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Click on the map to select the exact location of the issue
              </p>
              <GoogleMap
                onLocationSelect={handleLocationSelect}
                height="300px"
              />
              {location && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Location Selected</p>
                      <p className="text-sm text-green-600">{location.address}</p>
                      <p className="text-xs text-green-500">Barangay: {location.barangay}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Photos/Videos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload photos or videos to help illustrate the issue
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="btn-secondary cursor-pointer inline-block"
              >
                Choose Files
              </label>
            </div>

            {formData.mediaUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.mediaUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;