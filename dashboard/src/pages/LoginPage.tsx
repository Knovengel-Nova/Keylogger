import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login(username || 'admin');
    navigate('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
      >
        <h1 className="text-lg font-semibold text-[var(--color-text)]">AMASP Admin</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Demo login — no real auth backend yet, any username signs you in.
        </p>
        <label className="mt-5 block text-xs font-medium text-[var(--color-text-faint)]">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
