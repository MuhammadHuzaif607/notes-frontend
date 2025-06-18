import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';

import ProtectedRoute from './components/ProtectedRoute';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CreateNoteForm from './pages/CreateNoteForm';
import NoteDetails from './pages/NoteDetails';
import NoteVersions from './pages/NoteVersions';
import NoteAuditLogs from './pages/NoteAuditLogs';
import NotesList from './pages/NotesList';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import UpdateNoteForm from './pages/UpdateNoteForm';
import AdminDashboard from './pages/ADMINdASHBOARD.JSX';

export default function App() {
  const { isAuthenticated, checkAuth, user } = useAuthStore();

  // ✅ Auto check auth on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/signin"
          element={!isAuthenticated ? <SignIn /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'ADMIN' ? <AdminDashboard /> : <Dashboard />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/notes"
          element={
            <ProtectedRoute>
              <NotesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/new"
          element={
            <ProtectedRoute>
              <CreateNoteForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NoteDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id/versions"
          element={
            <ProtectedRoute>
              <NoteVersions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id/edit"
          element={
            <ProtectedRoute>
              <UpdateNoteForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id/audit-logs"
          element={
            <ProtectedRoute>
              <NoteAuditLogs />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}
