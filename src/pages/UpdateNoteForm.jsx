import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNoteStore } from '../store/useNoteStore'; // Import your store

const availableTags = [
  {
    id: 'b4bd95ac-887c-4a3f-814c-5cd822c5299f',
    name: 'idea',
    color: 'bg-blue-100 text-blue-800',
    icon: '💡',
  },
  {
    id: 'cb4c5469-bcb9-4694-9161-d35a0528e124',
    name: 'project',
    color: 'bg-purple-100 text-purple-800',
    icon: '🚀',
  },
  {
    id: 'ac2bb773-1400-4224-96d5-27d9cc6da160',
    name: 'task',
    color: 'bg-green-100 text-green-800',
    icon: '✓',
  },
];

export default function UpdateNoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Zustand store
  const {
    selectedNote,
    isLoading,
    error: storeError,
    fetchNoteById,
    updateNote,
  } = useNoteStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('PRIVATE');
  const [tagIds, setTagIds] = useState([]);
  const [customUserIds, setCustomUserIds] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagChange = (tagId) => {
    // Make sure only valid tags can be toggled
    if (!availableTags.some((tag) => tag.id === tagId)) return;

    setTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  useEffect(() => {
    if (id) {
      fetchNoteById(id, true);
    }
  }, [id, fetchNoteById]);

  useEffect(() => {
    console.log('Updated tagIds:', tagIds);
  }, [tagIds]);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setDescription(selectedNote.description || '');
      setVisibility(selectedNote.visibility || 'PRIVATE');

      // Filter only allowed tag IDs
      const validTagIds = (selectedNote.tags || [])
        .map((tag) => tag.id)
        .filter((id) => availableTags.some((t) => t.id === id));
      setTagIds(validTagIds);

      setCustomUserIds(selectedNote.customUserIds || []);
    }
  }, [selectedNote]);

  // const handleCheckboxChange = (value) => {
  //   handleTagChange(value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      await updateNote(id, {
        title: title.trim(),
        description: description.trim(),
        visibility,
        tags: tagIds,
        customUserIds,
      });

      setSuccess('Note updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.log('Error', err);
      setError('Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading note...</p>
        </div>
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Note
          </h3>
          <p className="text-gray-600 mb-6">{storeError}</p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Note</h1>
          <p className="text-gray-600">
            Make changes to your note and keep it organized
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Note Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter a descriptive title for your note..."
                    required
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Write your note content here..."
                    required
                  />
                </div>
              </div>

              {/* Visibility Settings */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Privacy Settings
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: 'PRIVATE',
                      label: 'Private',
                      icon: '🔒',
                      desc: 'Only you can see this',
                    },
                    {
                      value: 'PUBLIC',
                      label: 'Public',
                      icon: '🌍',
                      desc: 'Everyone can see this',
                    },
                    {
                      value: 'CUSTOM',
                      label: 'Custom',
                      icon: '👥',
                      desc: 'Selected users only',
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        visibility === option.value
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={visibility === option.value}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {option.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Users Input */}
              {visibility === 'CUSTOM' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                  <label className="block text-sm font-semibold text-blue-900">
                    Custom User IDs
                  </label>
                  <input
                    type="text"
                    value={customUserIds.join(', ')}
                    onChange={(e) =>
                      setCustomUserIds(
                        e.target.value
                          .split(',')
                          .map((id) => Number(id.trim()))
                          .filter((id) => !isNaN(id) && id > 0)
                      )
                    }
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter user IDs separated by commas (e.g., 1, 2, 3)"
                  />
                  <p className="text-xs text-blue-700">
                    Add user IDs of people who should have access to this note
                  </p>
                </div>
              )}

              {/* Tags Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Tags
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableTags.map((tag) => (
                    <label
                      key={tag.id}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                        tagIds.includes(tag.id)
                          ? `${tag.color} border-current ring-2 ring-offset-1`
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={tag.id}
                        checked={tagIds.includes(tag.id)}
                        onChange={() => {
                          console.log('tag id', tag.id);
                          handleTagChange(tag.id);
                        }}
                        className="sr-only"
                      />
                      <span className="text-lg">{tag.icon}</span>
                      <span className="font-medium capitalize">{tag.name}</span>
                      {tagIds.includes(tag.id) && (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Error and Success Messages */}
              {(error || storeError) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-red-800 font-medium">
                    {error || storeError}
                  </p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>Update Note</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
