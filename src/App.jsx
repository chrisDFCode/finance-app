import React, { useEffect, useState } from 'react';
import FinanceDesignDashboard from './pages/FinanceDesignDashboard';
import AuthPage from './pages/AuthPage';
import { authService } from './services/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDE7DD', color: '#1F2937' }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return <FinanceDesignDashboard user={session.user} onSignOut={authService.signOut} />;
}

export default App;
