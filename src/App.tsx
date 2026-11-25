import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';

// Pages
import IntroPage from './pages/IntroPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

// Trainee Pages
import HomePage from './pages/trainee/HomePage';
import ExerciseGuidePage from './pages/trainee/ExerciseGuidePage';
import LiveWorkoutPage from './pages/trainee/LiveWorkoutPage';
import WorkoutSummaryPage from './pages/trainee/WorkoutSummaryPage';
import HistoryPage from './pages/trainee/HistoryPage';
import SessionDetailPage from './pages/trainee/SessionDetailPage';
import ProfilePage from './pages/trainee/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageExercises from './pages/admin/ManageExercises';
import ManageRules from './pages/admin/ManageRules';
import AddEditRule from './pages/admin/AddEditRule';
import SystemLogs from './pages/admin/SystemLogs';

// Route Guard
function RequireAuth({ children, role }: { children: React.ReactNode; role?: 'Trainee' | 'Admin' }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // If not logged in, redirect to login, preserving destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // If wrong role, redirect to appropriate home
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/'} replace />;
  }

  return <>{children}</>;
}

// Initial Entry Router (checks intro seen)
function RootRedirect() {
  const { user } = useAuth();
  const hasSeenIntro = sessionStorage.getItem('aifit_intro_seen');

  if (!hasSeenIntro) {
    return <Navigate to="/intro" replace />;
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return user.role === 'Admin' ? <Navigate to="/admin" replace /> : <HomePage />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Cinematic Intro & Landing */}
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/welcome" element={<LandingPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Trainee Portal */}
            <Route path="/" element={<RootRedirect />} />
            <Route
              path="/exercise/:id/guide"
              element={
                <RequireAuth role="Trainee">
                  <ExerciseGuidePage />
                </RequireAuth>
              }
            />
            <Route
              path="/exercise/:id/workout"
              element={
                <RequireAuth role="Trainee">
                  <LiveWorkoutPage />
                </RequireAuth>
              }
            />
            <Route
              path="/session/:id/summary"
              element={
                <RequireAuth role="Trainee">
                  <WorkoutSummaryPage />
                </RequireAuth>
              }
            />
            <Route
              path="/history"
              element={
                <RequireAuth role="Trainee">
                  <HistoryPage />
                </RequireAuth>
              }
            />
            <Route
              path="/history/:sessionId"
              element={
                <RequireAuth role="Trainee">
                  <SessionDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth role="Trainee">
                  <ProfilePage />
                </RequireAuth>
              }
            />

            {/* Admin Portal */}
            <Route
              path="/admin"
              element={
                <RequireAuth role="Admin">
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAuth role="Admin">
                  <ManageUsers />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/exercises"
              element={
                <RequireAuth role="Admin">
                  <ManageExercises />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/rules"
              element={
                <RequireAuth role="Admin">
                  <ManageRules />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/rules/new"
              element={
                <RequireAuth role="Admin">
                  <AddEditRule />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/rules/:id/edit"
              element={
                <RequireAuth role="Admin">
                  <AddEditRule />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <RequireAuth role="Admin">
                  <SystemLogs />
                </RequireAuth>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gold/15 text-gold flex items-center justify-center font-black text-2xl mb-4 font-display">
                    404
                  </div>
                  <h1 className="font-display font-extrabold text-3xl text-text-primary tracking-tight mb-2">
                    Page Not Found
                  </h1>
                  <p className="font-body text-sm text-text-secondary max-w-sm mb-6">
                    The requested URL does not exist or may have been relocated.
                  </p>
                  <a
                    href="/"
                    className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-white text-sm font-semibold shadow-md transition-all"
                  >
                    Return to Home
                  </a>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
