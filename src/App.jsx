import React, { useEffect, useState } from 'react';
import FinanceDesignDashboard from './pages/FinanceDesignDashboard';
import AuthPage from './pages/AuthPage';
import { authService } from './services/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    return window.matchMedia('(max-width: 767px)').matches;
  });

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
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    function handleChange(event) {
      setIsMobileViewport(event.matches);
    }

    mediaQuery.addEventListener('change', handleChange);
    setIsMobileViewport(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const content = loading ? (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDE7DD', color: '#1F2937' }}>
      Loading...
    </div>
  ) : !session ? (
    <AuthPage forceMobileView={isMobileViewport} />
  ) : (
    <FinanceDesignDashboard
      user={session.user}
      onSignOut={authService.signOut}
      forceMobileView={isMobileViewport}
    />
  );

  return <div className="relative min-h-screen">{content}</div>;
}

export default App;
