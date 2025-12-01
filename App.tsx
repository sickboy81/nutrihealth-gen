import React from 'react';
import { HashRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import NutriScan from './pages/NutriScan';
import Recipes from './pages/Recipes';
import Dashboard from './pages/Dashboard';
import HealthPlan from './pages/HealthPlan';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { I18nProvider } from './contexts/I18nContext';
import { UserDataProvider } from './contexts/UserDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Hide header/bottom nav on landing page, login, and onboarding
  const hideNav = ['/', '/login', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {user && !hideNav && <Header />}
      <main className={user && !hideNav ? "pt-20 pb-24" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/nutriscan" element={<ProtectedRoute><NutriScan /></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
          <Route path="/health-plan" element={<ProtectedRoute><HealthPlan /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
      {user && !hideNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <UserDataProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </UserDataProvider>
      </I18nProvider>
    </AuthProvider>
  );
}

export default App;
