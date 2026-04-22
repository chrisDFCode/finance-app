import { useState } from 'react';
import { authService } from '../services/supabaseClient';

export default function AuthPage() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#EDE7DD' }}>
      <div className="w-full max-w-md rounded-xl border p-6 shadow-soft" style={{ backgroundColor: '#F7F1E6', borderColor: '#D9CDBB' }}>
        <div className="mb-5 text-center">
          <h1 className="text-2xl font-semibold" style={{ color: '#1F2937' }}>
            {mode === 'signup' ? 'Create your Barya account' : 'Sign in to Barya'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
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
            <label className="mb-1 block text-sm" style={{ color: '#6B7280' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none"
              style={{ backgroundColor: '#FFFDF8', color: '#1F2937', borderColor: '#CFC5B5' }}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm" style={{ color: '#6B7280' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:outline-none"
              style={{ backgroundColor: '#FFFDF8', color: '#1F2937', borderColor: '#CFC5B5' }}
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
          style={{ backgroundColor: '#E6DCCB', color: '#1F2937', borderColor: '#BFAF97' }}
        >
          Continue with Google
        </button>

        <div className="mt-5 text-center text-sm" style={{ color: '#6B7280' }}>
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
