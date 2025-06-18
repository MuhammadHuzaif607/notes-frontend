import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Button } from '../components/Button';
import axios from 'axios';
import { useNoteStore } from '../store/useNoteStore';

const API_BASE_URL = 'https://gymconnect.muhammadhuzaif.me';

const visibilityConfig = {
  private: { icon: '🔒', color: 'bg-gray-100 text-gray-700', label: 'Private' },
  public: { icon: '🌍', color: 'bg-blue-100 text-blue-700', label: 'Public' },
  custom: {
    icon: '👥',
    color: 'bg-purple-100 text-purple-700',
    label: 'Custom',
  },
};

const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-yellow-100 text-yellow-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
];

export default function NotesList() {
  // const [notes, setNotes] = useState([]);
  const [includeArchived, setIncludeArchived] = useState(false);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { fetchNotes, notes, loading, deleteNote } = useNoteStore();

  const navigate = useNavigate();

  // const fetchNotes = async () => {
  //   try {
  //     setLoading(true);
  //     const token = localStorage.getItem('access_token');
  //     const res = await axios.get(`${API_BASE_URL}/notes`, {
  //       params: { includeArchived },
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setNotes(res.data);
  //   } catch (err) {
  //     console.log('Error', err);
  //     setError('Failed to load notes');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const PermanentDeleteNote = (noteId) => {
    try {
      deleteNote(noteId);
      fetchNotes();
    } catch (err) {
      console.log('Error', err);
    }
  };

  useEffect(() => {
    fetchNotes(includeArchived);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeArchived]);

  const filteredNotes = notes.filter((note) => {
   const searchLower = searchTerm.toLowerCase();

  const matchesTitle = note.title.toLowerCase().includes(searchLower);
  const matchesDescription = note.description.toLowerCase().includes(searchLower);
  const matchesTag = (note.tags || []).some((tag) =>
    tag.name.toLowerCase().includes(searchLower)
  );

  const matchesSearch = matchesTitle || matchesDescription || matchesTag;

  const matchesFilter =
    selectedFilter === 'all' ||
    note.visibility.toLowerCase() === selectedFilter;

  return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTagColor = (index) => {
    return tagColors[index % tagColors.length];
  };

  async function archiveNote(noteId) {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch {
      setError('Failed to archive note');
    }
  }

  async function restoreNote(noteId) {
    const token = localStorage.getItem('access_token');
    try {
      await axios.patch(
        `${API_BASE_URL}/notes/${noteId}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotes();
    } catch {
      setError('Failed to restore note');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">📚</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Your Notes
                </h1>
                <p className="text-gray-600 mt-1">
                  {filteredNotes.length} note
                  {filteredNotes.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/notes/new')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>✨</span>
                <span>New Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 focus:outline-none"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 pr-8 transition-all duration-200 focus:outline-none"
              >
                <option value="all">All Notes</option>
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="custom">Custom</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Archive Toggle */}
            <label className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors duration-200">
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Show Archived
              </span>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-6">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠️</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-400">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No notes found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start by creating your first note'}
            </p>
            <button
              onClick={() => navigate('/notes/new')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => {
              const visibilityInfo =
                visibilityConfig[note.visibility.toLowerCase()] ||
                visibilityConfig.private;

              return (
                <div
                  key={note.id}
                  className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                    note.archived ? 'opacity-75' : ''
                  }`}
                >
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
                        {note.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${visibilityInfo.color}`}
                        >
                          <span className="mr-1">{visibilityInfo.icon}</span>
                          {visibilityInfo.label}
                        </span>
                        {note.archived && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            📦 Archived
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Note Content */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {note.description}
                  </p>

                  {/* Tags */}
                  {note.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag, index) => (
                        <span
                          key={tag.id}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(
                            index
                          )}`}
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Date */}
                  {note.createdAt && (
                    <p className="text-xs text-gray-500 mb-4">
                      Created {formatDate(note.createdAt)}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/notes/${note.id}`)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>👁️</span>
                      <span>View</span>
                    </button>

                    {!note.archived ? (
                      <>
                        <button
                          onClick={() => archiveNote(note.id)}
                          className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                        >
                          <span>📦</span>
                          <span>Archive</span>
                        </button>
                        <button
                          onClick={() => navigate(`/notes/${note.id}/edit`)}
                          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => restoreNote(note.id)}
                          className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                        >
                          <span>🔄</span>
                          <span>Restore</span>
                        </button>
                        <button
                          onClick={() => PermanentDeleteNote(note.id)}
                          className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
