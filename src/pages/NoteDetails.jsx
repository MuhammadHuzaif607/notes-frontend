import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNoteStore } from '../store/useNoteStore';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';
import {
  FiEdit2,
  FiArchive,
  FiRotateCcw,
  FiClock,
  FiList,
  FiEye,
  FiTag,
  FiArrowLeft,
  FiStar,
} from 'react-icons/fi';

export default function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedNote: note,
    isLoading: loading,
    error,
    fetchNoteById,
    archiveNote: archiveNoteInStore,
    restoreNote: restoreNoteInStore,
  } = useNoteStore();

  console.log('Selected note', note);

  useEffect(() => {
    fetchNoteById(id, true);
  }, [id, fetchNoteById]);

  const handleArchive = async () => {
    try {
      await archiveNoteInStore(id);
      toast.success('Note archived successfully');
    } catch {
      toast.error('Failed to archive note');
    }
  };

  const handleRestore = async () => {
    try {
      await restoreNoteInStore(id);
      toast.success('Note restored successfully');
    } catch {
      toast.error('Failed to restore note');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
          <div className="mt-4 text-center">
            <p className="text-indigo-600 font-medium animate-pulse">
              Loading note...
            </p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-8 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );

  if (!note)
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-yellow-100 p-8 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Note not found
            </h3>
            <p className="text-yellow-600 mb-4">
              The note you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 group">
            <FiArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="font-medium">
              <Link to="/dashboard/notes">Back to Notes</Link>
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:shadow-3xl transition-shadow duration-500">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-3 leading-tight">
                    {note.title}
                  </h1>
                  <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
                    {note.description}
                  </p>
                </div>
                {note.archived && (
                  <div className="ml-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-yellow-400 text-yellow-900 shadow-lg">
                      <FiArchive size={16} />
                      Archived
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <FiStar size={48} />
            </div>
            <div className="absolute bottom-4 left-4 opacity-10">
              <FiStar size={32} />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Metadata Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Visibility Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FiEye size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Visibility</h3>
                </div>
                <p className="text-blue-700 font-medium capitalize">
                  {note.visibility}
                </p>
              </div>

              {/* Tags Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <FiTag size={20} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Tags</h3>
                </div>
                {note.tags?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-purple-600 italic">No tags assigned</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-6">
              {/* Primary Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/notes/${note.id}/versions`)}
                  className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                    <FiClock size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Version History</h3>
                    <p className="text-blue-100">View all versions</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate(`/notes/${note.id}/audit-logs`)}
                  className="group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                    <FiList size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Audit Logs</h3>
                    <p className="text-gray-200">View activity logs</p>
                  </div>
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate(`/notes/${id}/edit`)}
                    className="group bg-white border-2 border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 rounded-xl px-6 py-3 flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <FiEdit2
                      size={18}
                      className="group-hover:rotate-12 transition-transform duration-300"
                    />
                    <span className="font-medium">Edit Note</span>
                  </button>

                  {!note.archived ? (
                    <button
                      onClick={handleArchive}
                      className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl px-6 py-3 flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <FiArchive
                        size={18}
                        className="group-hover:rotate-12 transition-transform duration-300"
                      />
                      <span className="font-medium">Archive</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleRestore}
                      className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-6 py-3 flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <FiRotateCcw
                        size={18}
                        className="group-hover:rotate-180 transition-transform duration-300"
                      />
                      <span className="font-medium">Restore</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
