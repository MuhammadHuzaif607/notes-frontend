import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useNoteStore } from '../store/useNoteStore';
import { Button } from '../components/Button';

export default function AdminDashboard() {
  const { user, isAuthenticated, logout, checkAuth, getProfile } =
    useAuthStore();
  const { notes, isLoading, error, getNotesOfUser, updateNote, deleteNote } =
    useNoteStore();
  const navigate = useNavigate();

  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showUserNotes, setShowUserNotes] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    checkAuth();
    getProfile();
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, checkAuth, navigate, getProfile]);

  const handleGetUserNotes = async () => {
    if (!selectedUserId.trim()) return;
    await getNotesOfUser(selectedUserId);
    setShowUserNotes(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setEditTitle(note.title || '');
    setEditContent(note.description || '');
  };

  const handleSaveEdit = async () => {
    if (!editingNote) return;

    const updateData = {
      title: editTitle.trim(),
      content: editContent.trim(),
    };

    await updateNote(editingNote.id, updateData);
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');

    // Refresh notes for current user
    if (selectedUserId) {
      await getNotesOfUser(selectedUserId);
    }
  };

  const handleDeleteNote = (note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    await deleteNote(noteToDelete.id);
    setShowDeleteModal(false);
    setNoteToDelete(null);

    // Refresh notes for current user
    if (selectedUserId) {
      await getNotesOfUser(selectedUserId);
    }
  };

  const filteredNotes =
    notes?.filter(
      (note) =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  //   const quickActions = [
  //     {
  //       title: 'Create New Note',
  //       description: 'Start writing your thoughts',
  //       icon: '✨',
  //       action: () => navigate('/notes/new'),
  //       gradient: 'from-blue-500 to-cyan-500',
  //       hoverGradient: 'hover:from-blue-600 hover:to-cyan-600',
  //     },
  //     {
  //       title: 'View My Notes',
  //       description: 'Browse all your notes',
  //       icon: '📚',
  //       action: () => navigate('/dashboard/notes'),
  //       gradient: 'from-purple-500 to-pink-500',
  //       hoverGradient: 'hover:from-purple-600 hover:to-pink-600',
  //     },
  //     {
  //       title: 'User Management',
  //       description: 'Manage user accounts',
  //       icon: '👥',
  //       action: () => navigate('/admin/users'),
  //       gradient: 'from-emerald-500 to-teal-500',
  //       hoverGradient: 'hover:from-emerald-600 hover:to-teal-600',
  //     },
  //     {
  //       title: 'System Analytics',
  //       description: 'View platform statistics',
  //       icon: '📊',
  //       action: () => navigate('/admin/analytics'),
  //       gradient: 'from-violet-500 to-purple-500',
  //       hoverGradient: 'hover:from-violet-600 hover:to-purple-600',
  //     },
  //   ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name || 'Admin'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {/* <Button className="text-indigo-700 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all duration-200">
                <Link to="/profile" className="flex items-center space-x-2">
                  <span>👤</span>
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button> */}
              <Button
                onClick={logout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions 
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">⚡</span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`group relative bg-gradient-to-r ${action.gradient} ${action.hoverGradient} p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 bg-white/10 rounded-full"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-white/90 text-sm">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
*/}
        {/* User Notes Management */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📝</span>
            User Notes Management
          </h2>

          {/* User ID Input */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  placeholder="Enter user ID to fetch notes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleGetUserNotes}
                  disabled={!selectedUserId.trim() || isLoading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Fetch Notes'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Notes Display */}
          {showUserNotes && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notes by title or content..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
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
              </div>

              {/* Notes Count */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredNotes.length} of {notes?.length || 0} notes
                  {selectedUserId && ` for User ID: ${selectedUserId}`}
                </p>
                {filteredNotes.length > 0 && (
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {filteredNotes.length} Results
                    </span>
                  </div>
                )}
              </div>

              {/* Notes List */}
              {filteredNotes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 opacity-50">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {notes?.length === 0
                      ? 'No notes found'
                      : 'No matching notes'}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {notes?.length === 0
                      ? "This user hasn't created any notes yet."
                      : "Try adjusting your search terms to find what you're looking for."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 truncate flex-1 mr-2 group-hover:text-indigo-600 transition-colors duration-200">
                          {note.title || 'Untitled Note'}
                        </h3>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit note"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Delete note"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                          Description:{' '}
                          {note.description || 'No content available'}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                          Visibility {note?.visibility}
                        </p>
                      </div>

                      <div className="mb-2 flex gap-x-2">
                        {note.tags.map((tag) => {
                          return <p className="text-gray-700">{tag.name}</p>;
                        })}
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                        {/* <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-gray-100 rounded-full font-mono">
                            ID: {note.id}
                          </span>
                        </div> */}
                        <span className="font-medium">
                          {note.createdAt
                            ? new Date(note.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )
                            : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingNote && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3">✏️</span>
                  Edit Note
                </h3>
                <button
                  onClick={() => setEditingNote(null)}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:rotate-90"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Note Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Enter note title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Note Content
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none leading-relaxed"
                    placeholder="Write your note content here..."
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Note ID:</span>{' '}
                    {editingNote.id}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Created:</span>{' '}
                    {editingNote.createdAt
                      ? new Date(editingNote.createdAt).toLocaleString()
                      : 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setEditingNote(null)}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && noteToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Delete Note
                </h3>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to delete this note?
                </p>
                <p className="text-sm font-semibold text-gray-800 mb-6 p-3 bg-gray-50 rounded-lg">
                  "{noteToDelete.title || 'Untitled Note'}"
                </p>
                <p className="text-sm text-red-600 mb-8">
                  This action cannot be undone.
                </p>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDeleteNote}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
