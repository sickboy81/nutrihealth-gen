import React, { Suspense, lazy } from 'react';
import { HashRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { I18nProvider } from './contexts/I18nContext';
import { UserDataProvider } from './contexts/UserDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy load pages for code splitting with error handling
const lazyLoad = (importFunc: () => Promise<{ default: React.ComponentType<any> }>) => {
  return lazy(() => importFunc().catch((error) => {
    console.error('Error loading component:', error);
    // Return a fallback component
    return {
      default: () => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar</h1>
            <p className="text-gray-600 mb-4">Por favor, recarregue a página.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    };
  }));
};

const LandingPage = lazyLoad(() => import('./pages/LandingPage'));
const Login = lazyLoad(() => import('./pages/Login'));
const Onboarding = lazyLoad(() => import('./pages/Onboarding'));
const Dashboard = lazyLoad(() => import('./pages/Dashboard'));
const NutriScan = lazyLoad(() => import('./pages/NutriScan'));
const Recipes = lazyLoad(() => import('./pages/Recipes'));
const HealthPlan = lazyLoad(() => import('./pages/HealthPlan'));
const Chat = lazyLoad(() => import('./pages/Chat'));
const Profile = lazyLoad(() => import('./pages/Profile'));
const Settings = lazyLoad(() => import('./pages/Settings'));
const About = lazyLoad(() => import('./pages/About'));
const Terms = lazyLoad(() => import('./pages/Terms'));
const Privacy = lazyLoad(() => import('./pages/Privacy'));
const Contact = lazyLoad(() => import('./pages/Contact'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <Spinner className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
      <p className="text-sm text-gray-500">Carregando...</p>
    </div>
  </div>
);

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

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Hide header/bottom nav on landing page, login, onboarding, and public pages
  const hideNav = ['/', '/login', '/onboarding', '/terms', '/privacy', '/contact'].includes(location.pathname);
  
  // Hide bottom nav on settings pages and public pages
  const hideBottomNav = ['/settings', '/profile', '/about', '/terms', '/privacy', '/contact'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {user && !hideNav && <Header />}
      <main className={user && !hideNav ? (hideBottomNav ? "pt-20 pb-6" : "pt-20 pb-24") : ""}>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
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
