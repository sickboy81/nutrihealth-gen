import React from 'react';
import { HashRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { I18nProvider } from './contexts/I18nContext';
import { UserDataProvider } from './contexts/UserDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages directly (no lazy loading)
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import NutriScan from './pages/NutriScan';
import Recipes from './pages/Recipes';
import HealthPlan from './pages/HealthPlan';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner className="w-8 h-8 text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner className="w-8 h-8 text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Hide header/bottom nav on landing page, login, onboarding, and public pages
  const hideNav = ['/', '/login', '/onboarding', '/terms', '/privacy', '/contact'].includes(location.pathname);
  
  // Hide bottom nav on settings pages, admin, and public pages
  const hideBottomNav = ['/settings', '/profile', '/about', '/admin', '/terms', '/privacy', '/contact'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {user && !hideNav && <Header />}
      <main className={user && !hideNav ? (hideBottomNav ? "pt-20 pb-6" : "pt-20 pb-24") : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/nutriscan" element={<ProtectedRoute><NutriScan /></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
          <Route path="/health-plan" element={<ProtectedRoute><HealthPlan /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {user && !hideNav && !hideBottomNav && <BottomNav />}
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
