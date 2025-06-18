import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const { user, isAuthenticated, logout, checkAuth, getProfile } =
    useAuthStore();
  const navigate = useNavigate();
  // Attempt to connect to the backend
  const socket = io('https://gymconnect.muhammadhuzaif.me/notifications', {
    transports: ['websocket'],
    auth: {
      token: localStorage.getItem('access_token'), // Send JWT for authentication
    },
  });
  // Event listeners
  socket.on('connect', () => {
    console.log('Connected to notifications service');
  });

  socket.on('connected', (data) => {
    console.log('Server connection confirmed:', data);
  });

  socket.on('notification', (notification) => {
    console.log('New notification:', notification);
    // Handle notification UI updates here
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
  });

  useEffect(() => {
    checkAuth();
    getProfile();
    if (!isAuthenticated) {
      navigate('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, checkAuth, navigate]);

  const quickActions = [
    {
      title: 'Create New Note',
      description: 'Start writing your thoughts',
      icon: '✨',
      action: () => navigate('/notes/new'),
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'hover:from-blue-600 hover:to-cyan-600',
    },
    {
      title: 'View My Notes',
      description: 'Browse all your notes',
      icon: '📚',
      action: () => navigate('/dashboard/notes'),
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'hover:from-purple-600 hover:to-pink-600',
    },
  ];

  // console.log('User', user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'User'}
                </h1>
                <p className="text-sm text-gray-500 capitalize">ID {user.id}</p>
              </div>
            </div>
            <div className="flex gap-x-2 items-center">
              <Button className="text-indigo-700 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all duration-200">
                <Link to="/profile" className="flex items-center space-x-2">
                  <span>👤</span>
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>
              <Button
                onClick={logout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="text-3xl opacity-70">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
        */}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`group relative bg-gradient-to-r ${action.gradient} ${action.hoverGradient} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-left overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-white/10 rounded-full"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-white/80">{action.description}</p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>

          <div className="space-y-4">
            {[
              {
                action: 'Created',
                item: 'Meeting Notes - Q4 Planning',
                time: '2 hours ago',
                type: 'create',
              },
              {
                action: 'Updated',
                item: 'Project Requirements',
                time: '1 day ago',
                type: 'edit',
              },
              {
                action: 'Shared',
                item: 'Weekly Report',
                time: '2 days ago',
                type: 'share',
              },
              {
                action: 'Created',
                item: 'Brainstorm Session Ideas',
                time: '3 days ago',
                type: 'create',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/40 transition-colors duration-200"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    activity.type === 'create'
                      ? 'bg-green-100 text-green-600'
                      : activity.type === 'edit'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {activity.type === 'create'
                    ? '✨'
                    : activity.type === 'edit'
                    ? '✏️'
                    : '📤'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}{' '}
                    <span className="text-gray-600">"{activity.item}"</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <button
              onClick={() => navigate('/dashboard/notes')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              View all activity →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
