import React, { useEffect, useState } from 'react';
import FinanceDesignDashboard from './pages/FinanceDesignDashboard';
import AuthPage from './pages/AuthPage';
import { authService } from './services/supabaseClient';

const VIEW_MODE_STORAGE_KEY = 'barya_view_mode';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(() => {
    const storedMode = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return storedMode === 'mobile' ? 'mobile' : 'desktop';
  });

  const isMobilePreview = viewMode === 'mobile';

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const activeSession = await authService.getSession();
        if (isMounted) setSession(activeSession);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
  }, [viewMode]);

  function renderWithPreview(content) {
    if (!isMobilePreview) return content;

    return (
      <div className="min-h-screen bg-[#D5D0C6] px-2 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto w-[390px] max-w-full min-h-[844px] overflow-hidden rounded-[30px] border-[10px] border-[#111827] shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  const content = loading ? (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDE7DD', color: '#1F2937' }}>
      Loading...
    </div>
  ) : !session ? (
    <AuthPage forceMobileView={isMobilePreview} />
  ) : (
    <FinanceDesignDashboard
      user={session.user}
      onSignOut={authService.signOut}
      forceMobileView={isMobilePreview}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  );

  return (
    <div className="relative min-h-screen">{renderWithPreview(content)}</div>
  );
}

export default App;
