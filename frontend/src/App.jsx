import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MemberLayout from './layouts/MemberLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthModal from './components/AuthModal';
import NotificationToast from './components/NotificationToast';
import MemberDashboardPage from './pages/MemberDashboardPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminControlCenterPage from './pages/AdminControlCenterPage';

function AppContent() {
  const { user, isLoggedIn, isAdmin } = useAuth();
  
  // Default initial route
  const [currentRoute, setCurrentRoute] = useState('/member/dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState('select');
  const [toast, setToast] = useState(null);

  // Auto-redirect user to appropriate portal after login / session restore
  useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin && !currentRoute.startsWith('/admin')) {
        setCurrentRoute('/admin/dashboard');
      } else if (!isAdmin && currentRoute.startsWith('/admin')) {
        setCurrentRoute('/member/dashboard');
        handleSetToast({ type: 'error', message: 'Access Restricted: Member accounts cannot access the Admin Control Center.' });
      }
    } else {
      if (currentRoute.startsWith('/admin')) {
        setCurrentRoute('/member/dashboard');
      }
    }
  }, [isLoggedIn, isAdmin]);

  const handleSetToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAuth = (viewMode = 'select') => {
    setAuthInitialView(viewMode);
    setIsAuthOpen(true);
  };

  const handleNavigate = (route) => {
    if (route.startsWith('/admin') && !isAdmin) {
      handleSetToast({ type: 'error', message: 'Access Restricted: Admin role required.' });
      handleOpenAuth('admin_login');
      return;
    }
    setCurrentRoute(route);
  };

  const handleLoginSuccessRedirect = (targetRoute) => {
    setCurrentRoute(targetRoute);
    handleSetToast({ 
      type: 'success', 
      message: targetRoute.startsWith('/admin') 
        ? 'Welcome to the Admin Control Center!' 
        : 'Logged in successfully to Member Portal!' 
    });
  };

  // Determine active layout
  const isMemberPortal = !isAdmin || currentRoute.startsWith('/member');

  return (
    <>
      {isMemberPortal ? (
        <MemberLayout
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenAuthModal={() => handleOpenAuth('select')}
        >
          {currentRoute === '/member/dashboard' && (
            <MemberDashboardPage
              setToast={handleSetToast}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === '/member/desks' && (
            <MemberDashboardPage
              setToast={handleSetToast}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === '/member/bookings' && (
            isLoggedIn ? (
              <MyBookingsPage setToast={handleSetToast} />
            ) : (
              <div className="py-20 text-center max-w-md mx-auto space-y-4">
                <h2 className="text-2xl font-serif font-bold text-[#2A3026]">Authentication Required</h2>
                <p className="text-xs text-[#62685B]">Please sign in to access your member reservations.</p>
                <div className="flex items-center justify-center space-x-3 pt-2">
                  <button
                    onClick={() => handleOpenAuth('member_login')}
                    className="px-6 py-3 rounded-xl bg-[#DCA278] text-white text-xs font-bold uppercase tracking-wider shadow-organic-sm hover:bg-[#C88D63] transition"
                  >
                    Member Sign In
                  </button>
                  <button
                    onClick={() => handleOpenAuth('member_signup')}
                    className="px-6 py-3 rounded-xl bg-[#2A3026] text-white text-xs font-bold uppercase tracking-wider shadow-organic-sm hover:bg-[#353C30] transition"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )
          )}
        </MemberLayout>
      ) : (
        <AdminLayout
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
        >
          {currentRoute === '/admin/dashboard' && (
            <AdminControlCenterPage setToast={handleSetToast} activeAdminTab="dashboard" />
          )}
          {currentRoute === '/admin/desks' && (
            <AdminControlCenterPage setToast={handleSetToast} activeAdminTab="inventory" />
          )}
          {currentRoute === '/admin/occupancy' && (
            <AdminControlCenterPage setToast={handleSetToast} activeAdminTab="occupancy" />
          )}
          {currentRoute === '/admin/bookings' && (
            <AdminControlCenterPage setToast={handleSetToast} activeAdminTab="bookings" />
          )}
        </AdminLayout>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialView={authInitialView}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccessRedirect}
      />

      {/* Feedback Toast */}
      <NotificationToast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
