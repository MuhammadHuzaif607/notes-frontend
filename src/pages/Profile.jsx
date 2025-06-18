// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { authAPI } from '../api/authAPI';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user, getProfile, updateProfile, updatePassword, updateAvatar } =
    useAuthStore();

  const [avatarPreview, setAvatarPreview] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProfile();
      } catch (err) {
        console.log('Error', err);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getProfile]);

  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10,15}$/, 'Phone must be valid')
        .nullable(),
    }),
    onSubmit: async (values) => {
      try {
        await updateProfile(values);
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update profile');
      }
    },
  });

  const passwordForm = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Z]/, 'Must include an uppercase letter')
        .matches(/[a-z]/, 'Must include a lowercase letter')
        .matches(/[0-9]/, 'Must include a number')
        .required('New password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await updatePassword(values);
        toast.success('Password updated successfully');
        passwordForm.resetForm();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update password');
      }
    },
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    try {
      await updateAvatar(file);
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update avatar');
    }
  };

  const handleRequestPasswordReset = async () => {
    if (!user?.email) return toast.error('Email not available');
    try {
      await authAPI.requestPasswordReset(user.email);
      toast.success('Password reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Profile Settings</h1>
          <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-8 py-4">
              {[
                { id: 'profile', label: 'Profile Info', icon: '👤' },
                { id: 'security', label: 'Security', icon: '🔒' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-8">
              {/* Avatar Section */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Picture</h3>
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <img
                      src={avatarPreview || '/default-avatar.png'}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-indigo-100"
                    />
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <span className="sr-only">Choose profile photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-indigo-500 file:to-purple-600 file:text-white hover:file:from-indigo-600 hover:file:to-purple-700 file:cursor-pointer file:transition-all file:duration-200"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a new profile picture. JPG, PNG or GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                <form onSubmit={profileForm.handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.values.name}
                          onChange={profileForm.handleChange}
                          onBlur={profileForm.handleBlur}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {profileForm.touched.name && profileForm.errors.name && (
                        <p className="text-red-600 text-sm">{profileForm.errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.values.email}
                          onChange={profileForm.handleChange}
                          onBlur={profileForm.handleBlur}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          placeholder="Enter your email"
                        />
                      </div>
                      {profileForm.touched.email && profileForm.errors.email && (
                        <p className="text-red-600 text-sm">{profileForm.errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.values.phone}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {profileForm.touched.phone && profileForm.errors.phone && (
                      <p className="text-red-600 text-sm">{profileForm.errors.phone}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={profileForm.isSubmitting}
                      className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      {profileForm.isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Update Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-8">
              <div className="max-w-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Password & Security</h3>
                
                {/* Password Reset Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Password Reset</h4>
                      <p className="text-gray-600 mb-4">
                        Send a secure password reset link to your email address. You'll receive instructions on how to create a new password.
                      </p>
                      <button
                        onClick={handleRequestPasswordReset}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span>Send Reset Link</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.82-.833-2.592 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Security Recommendations</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Use a strong password with mixed characters</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Don't share your password with anyone</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Log out from shared devices</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}