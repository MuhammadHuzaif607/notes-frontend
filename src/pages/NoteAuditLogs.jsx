import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Activity,
  User,
  Clock,
  FileText,
  Edit,
  Archive,
  Eye,
  Share,
  Trash2,
  Plus,
  ArrowLeft,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function NoteAuditLogs() {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/notes/${id}/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.log('Error', err);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const iconProps = { size: 18, className: 'text-white' };
    switch (action.toLowerCase()) {
      case 'created':
        return <Plus {...iconProps} />;
      case 'edited':
        return <Edit {...iconProps} />;
      case 'viewed':
        return <Eye {...iconProps} />;
      case 'shared':
        return <Share {...iconProps} />;
      case 'archived':
        return <Archive {...iconProps} />;
      case 'deleted':
        return <Trash2 {...iconProps} />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'edited':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'viewed':
        return 'bg-gradient-to-r from-purple-500 to-violet-600';
      case 'shared':
        return 'bg-gradient-to-r from-cyan-500 to-teal-600';
      case 'archived':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600';
      case 'deleted':
        return 'bg-gradient-to-r from-red-500 to-rose-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterAction === 'all' ||
      log.action.toLowerCase() === filterAction.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const uniqueActions = [...new Set(logs.map((log) => log.action))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-slate-600 absolute top-0 left-0"></div>
          <div className="mt-4 text-center">
            <p className="text-slate-600 font-medium animate-pulse">
              Loading audit logs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-8 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Logs
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchLogs()}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Navigation Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-slate-700 transition-colors duration-200 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="font-medium">Back to Note</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-slate-600 via-gray-700 to-slate-800 p-8 text-white relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Activity size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Audit Logs</h1>
                  <p className="text-slate-200">
                    Track all activities and changes
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-20">
              <FileText size={48} />
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search logs by action or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                >
                  <option value="all">All Actions</option>
                  {uniqueActions.map((action) => (
                    <option key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-700">
                  {logs.length}
                </p>
                <p className="text-gray-600 text-sm">Total Logs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-700">
                  {filteredLogs.length}
                </p>
                <p className="text-gray-600 text-sm">Filtered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-700">
                  {uniqueActions.length}
                </p>
                <p className="text-gray-600 text-sm">Action Types</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-700">
                  {new Set(logs.map((log) => log.performedBy?.id)).size}
                </p>
                <p className="text-gray-600 text-sm">Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <Activity size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Logs Found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterAction !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No audit logs found for this note.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredLogs.map((log, index) => (
                <div
                  key={log.id || index}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Action Icon */}
                    <div
                      className={`p-3 rounded-xl ${getActionColor(
                        log.action
                      )} shadow-lg flex-shrink-0`}
                    >
                      {getActionIcon(log.action)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {log.action}
                          </h3>
                          {log.details && (
                            <p className="text-gray-600 text-sm mt-1">
                              {log.details}
                            </p>
                          )}
                        </div>

                        {/* User Info */}
                        {log.performedBy && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">
                            <div className="p-1.5 bg-gray-100 rounded-full">
                              <User size={14} />
                            </div>
                            <span className="font-medium whitespace-nowrap">
                              {log.performedBy.name ||
                                `User #${log.performedBy.id}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <time dateTime={log.timestamp || log.createdAt}>
                          {new Date(
                            log.timestamp || log.createdAt
                          ).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
