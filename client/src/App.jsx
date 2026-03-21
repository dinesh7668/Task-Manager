import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import AnimatedBackground from './components/AnimatedBackground';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

/**
 * ProtectedRoute - Redirects to login if not authenticated
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-3 border-primary-500/30 border-t-primary-500 animate-spin" />
          <p className="text-sm text-dark-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
}

/**
 * PublicRoute - Redirects to dashboard if already authenticated
 */
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

/**
 * AppLayout - Main layout with sidebar for authenticated pages
 */
function AppLayout({ children }) {
  return (
    <TaskProvider>
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <Sidebar />
        <main className="lg:pl-64 relative z-10">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}

/**
 * App - Root application with routing and context providers
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
                background: '#1a1a1a',
                color: '#e5e5e5',
                border: '1px solid rgba(239, 68, 68, 0.15)'
              },
              success: {
                style: {
                  background: '#0a1a0a',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                },
                iconTheme: { primary: '#22c55e', secondary: '#0a1a0a' }
              },
              error: {
                style: {
                  background: '#1a0a0a',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                },
                iconTheme: { primary: '#ef4444', secondary: '#1a0a0a' }
              }
            }}
          />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout><DashboardPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/tasks" element={
              <ProtectedRoute>
                <AppLayout><TasksPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/calendar" element={
              <ProtectedRoute>
                <AppLayout><CalendarPage /></AppLayout>
              </ProtectedRoute>
            }/>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
