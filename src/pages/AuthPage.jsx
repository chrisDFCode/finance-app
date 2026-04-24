import { useState } from 'react';
import { MoonStar, Sun } from 'lucide-react';
import { authService } from '../services/supabaseClient';

export default function AuthPage() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode
    ? {
        pageBg: 'radial-gradient(circle at 20% 10%, #2A332D 0%, #1E2520 45%, #171D19 100%)',
        cardBg: '#242D27',
        cardBorder: '#3C4741',
        text: '#EDE7DD',
        muted: '#C7D0CA',
        inputBg: '#2A332D',
        inputBorder: '#516059',
        secondaryButtonBg: '#3A463F',
        secondaryButtonBorder: '#5F6C66',
      }
    : {
        pageBg: '#EDE7DD',
        cardBg: '#F7F1E6',
        cardBorder: '#D9CDBB',
        text: '#1F2937',
        muted: '#6B7280',
        inputBg: '#FFFDF8',
        inputBorder: '#CFC5B5',
        secondaryButtonBg: '#E6DCCB',
        secondaryButtonBorder: '#BFAF97',
      };

  const logoSrc = isDarkMode ? '/barya-logo-dark.png' : '/barya-logo.png';

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      if (mode === 'signup') {
        const data = await authService.signUpWithEmail(email, password);

        if (!data.session) {
          setNotice('Check your email to verify your account, then sign in.');
        } else {
          setNotice('Account created successfully. You are signed in.');
        }
      } else {
        await authService.signInWithEmail(email, password);
      }
    } catch (err) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError('');
    setNotice('');

    try {
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err?.message || 'Google sign-in failed.');
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: theme.pageBg,
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 shadow-soft"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
      >
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition"
            style={{
              backgroundColor: theme.secondaryButtonBg,
              color: theme.text,
              border: `1px solid ${theme.secondaryButtonBorder}`,
            }}
          >
            {isDarkMode ? <Sun size={14} /> : <MoonStar size={14} />}
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        <div className="mb-4 flex justify-center">
          <img src={logoSrc} alt="Barya Logo" className="h-20 w-20 object-contain" />
        </div>

        <div className="mb-5 text-center">
          <h1 className="text-2xl font-semibold" style={{ color: theme.text }}>
            {mode === 'signup' ? 'Create your Barya account' : 'Sign in to Barya'}
          </h1>
          <p className="mt-1 text-xs" style={{ color: theme.muted }}>
            Barya - Track and manage your expenses
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-800">{error}</div>
        ) : null}

        {notice ? (
          <div className="mb-4 rounded border border-green-300 bg-green-100 px-3 py-2 text-sm text-green-800">{notice}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm" style={{ color: theme.muted }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none"
              style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder }}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm" style={{ color: theme.muted }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none"
              style={{ backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder }}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded px-4 py-2 text-sm font-medium transition disabled:opacity-60"
            style={{ backgroundColor: '#007b34', color: '#EDE7DD' }}
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Sign up with email' : 'Sign in with email'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-3 w-full rounded border px-4 py-2 text-sm font-medium transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
          style={{ backgroundColor: theme.secondaryButtonBg, color: theme.text, borderColor: theme.secondaryButtonBorder }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.6 2.8-4 2.8-6.8 0-.7-.1-1.3-.2-2H12z" />
            <path fill="#34A853" d="M6.5 14.3l-.7.6-2.4 1.9C5 20 8.2 22 12 22c2.7 0 5- .9 6.6-2.5l-3.1-2.4c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.2z" />
            <path fill="#FBBC05" d="M3.4 7.1C2.5 8.8 2 10.3 2 12s.5 3.2 1.4 4.9c0 0 3.1-2.4 3.1-2.5-.2-.6-.4-1.3-.4-2s.1-1.4.4-2z" />
            <path fill="#4285F4" d="M12 4.8c1.9 0 3.6.7 4.9 1.9l2.7-2.7C17.9 2.4 15.2 1.3 12 1.3 8.2 1.3 5 3.3 3.4 7.1l3.1 2.4C7.3 6.6 9.3 4.8 12 4.8z" />
          </svg>
          {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
        </button>

        <div className="mt-5 text-center text-sm" style={{ color: theme.muted }}>
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setMode((prev) => (prev === 'signup' ? 'signin' : 'signup'));
              setError('');
              setNotice('');
            }}
            className="font-medium underline"
            style={{ color: '#007b34' }}
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
