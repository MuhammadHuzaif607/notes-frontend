import { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
// import axios from 'axios';
import { useNoteStore } from '../store/useNoteStore';

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

const visibilityOptions = [
  {
    value: 'PRIVATE',
    label: 'Private',
    description: 'Only you can see this note',
    icon: '🔒',
  },
  {
    value: 'PUBLIC',
    label: 'Public',
    description: 'Everyone can see this note',
    icon: '🌍',
  },
  {
    value: 'CUSTOM',
    label: 'Custom',
    description: 'Share with specific users',
    icon: '👥',
  },
];

export default function CreateNoteForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('PRIVATE');
  const [tagIds, setTagIds] = useState([]);
  const [customUserIds, setCustomUserIds] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { createNote,  } = useNoteStore();

  const handleCheckboxChange = (tagId) => {
    setTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description || !visibility) {
      setError('All required fields must be filled');
      return;
    }

    if (visibility === 'CUSTOM' && customUserIds.length === 0) {
      setError('Please enter at least one user ID for custom visibility');
      return;
    }

    try {
      setLoading(true);

      await createNote({
        title,
        description,
        visibility,
        tagIds,
        customUserIds,
      });

      setSuccess('Note created successfully!');
      setTitle('');
      setDescription('');
      setVisibility('PRIVATE');
      setTagIds([]);
      setCustomUserIds([]);
    } catch (err) {
      console.log('apna', err);
      setError(err.response?.data?.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Create New Note
          </h1>
          <p className="text-gray-600 mt-2">
            Capture and organize your thoughts beautifully
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Note Title
              </label>
              <div className="relative">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your note title..."
                  className="text-xl font-medium border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200 w-full"
                  required
                />
                <div className="absolute right-3 top-3 text-gray-400">📝</div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Description
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows="6"
                  className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 resize-none transition-all duration-200 focus:outline-none"
                  required
                />
                <div className="absolute right-3 top-3 text-gray-400">💭</div>
              </div>
            </div>

            {/* Visibility Section */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Visibility Settings
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visibilityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                      visibility === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={visibility === option.value}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{option.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {visibility === option.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Users Section */}
            {visibility === 'CUSTOM' && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Share with Users
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customUserIds.join(',')}
                    onChange={(e) =>
                      setCustomUserIds(
                        e.target.value
                          .split(',')
                          .map((id) => Number(id.trim()))
                          .filter((id) => !isNaN(id))
                      )
                    }
                    placeholder="Enter user IDs separated by commas (e.g., 1, 2, 3)"
                    className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">👥</div>
                </div>
              </div>
            )}

            {/* Tags Section */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Tags
              </label>
              <div className="flex flex-wrap gap-3">
                {availableTags.map((tag) => (
                  <label
                    key={tag.id}
                    className={`cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                      tagIds.includes(tag.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={tag.id}
                      checked={tagIds.includes(tag.id)}
                      onChange={() => handleCheckboxChange(tag.id)}
                      className="sr-only"
                    />
                    <span className="text-sm">{tag.icon}</span>
                    <span className="font-medium">{tag.name}</span>
                    {tagIds.includes(tag.id) && (
                      <svg
                        className="w-4 h-4 text-blue-600"
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

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <div className="flex items-center">
                  <span className="text-red-400 mr-2">⚠️</span>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✅</span>
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Your note will be saved securely
              </div>
              <Button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>✨</span>
                    <span>Create Note</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span>🎯</span>
              <span>Use descriptive titles to find your notes easily</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>🏷️</span>
              <span>Tags help organize and filter your content</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>🔒</span>
              <span>Private notes are only visible to you</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>👥</span>
              <span>Custom sharing lets you collaborate selectively</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
