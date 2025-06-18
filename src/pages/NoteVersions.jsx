import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/Button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function NoteVersions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reverting, setReverting] = useState(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchVersions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVersions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notes/${id}/versions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVersions(res.data);
    } catch {
      setError('Failed to load versions');
    } finally {
      setLoading(false);
    }
  };

  const revertToVersion = async (versionId) => {
    const confirmRevert = window.confirm(
      'Are you sure you want to revert to this version? This action cannot be undone.'
    );
    if (!confirmRevert) return;

    setReverting(versionId);
    try {
      await axios.post(
        `${API_BASE_URL}/notes/${id}/versions/${versionId}/revert`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Success animation/feedback before navigation
      setTimeout(() => {
        navigate(`/notes/${id}`);
      }, 500);
    } catch {
      alert('Failed to revert note');
      setReverting(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getVersionIcon = (index) => {
    if (index === 0) return '🟢'; // Latest version
    if (index === 1) return '🔵'; // Previous version
    return '⚪'; // Older versions
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading version history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Versions</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(`/notes/${id}`)}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-2 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Note
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Version History
              </h1>
              <p className="text-gray-600 mt-1">Track and manage all changes to your note</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {versions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Version History</h3>
            <p className="text-gray-500">This note doesn't have any saved versions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Versions</h3>
                  <p className="text-3xl font-bold text-blue-600">{versions.length}</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400"></div>
              
              {versions.map((version, index) => (
                <div key={version.id} className="relative flex items-start mb-6 group">
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 rounded-full bg-white border-4 border-blue-400 shadow-lg group-hover:border-purple-400 transition-colors duration-300 z-10"></div>
                  
                  {/* Version Card */}
                  <div className="ml-16 flex-1">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group-hover:scale-[1.02] overflow-hidden">
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getVersionIcon(index)}</span>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {version.title}
                              </h3>
                              {index === 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Current Version
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            Version {versions.length - index}
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="px-6 py-5">
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {version.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{formatDate(version.createdAt)}</span>
                            </div>
                          </div>
                          
                          {index !== 0 && (
                            <Button 
                              onClick={() => revertToVersion(version.id)}
                              disabled={reverting === version.id}
                              className={`
                                relative overflow-hidden transition-all duration-300
                                ${reverting === version.id 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                                }
                              `}
                            >
                              {reverting === version.id ? (
                                <div className="flex items-center space-x-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Reverting...</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                  </svg>
                                  <span>Revert to This</span>
                                </div>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}