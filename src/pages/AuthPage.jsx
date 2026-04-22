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
          <img src="/barya-logo-dark.png" alt="Barya Logo" className="h-20 w-20 object-contain" />
        </div>

        <div className="mb-5 text-center">
          <h1 className="text-2xl font-semibold" style={{ color: theme.text }}>
            {mode === 'signup' ? 'Create your Barya account' : 'Sign in to Barya'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: theme.muted }}>
            Track and manage your expenses securely.
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
          className="mt-3 w-full rounded border px-4 py-2 text-sm font-medium transition disabled:opacity-60"
          style={{ backgroundColor: theme.secondaryButtonBg, color: theme.text, borderColor: theme.secondaryButtonBorder }}
        >
          Continue with Google
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
