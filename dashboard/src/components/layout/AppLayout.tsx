import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { SimulatedBanner } from '../ui/SimulatedBanner';

const NAV = [
  { to: '/', label: 'Overview', end: true },
  { to: '/devices', label: 'Device Health' },
  { to: '/settings', label: 'Settings' },
];

export function AppLayout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <SimulatedBanner />
      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:block">
          <div className="mb-6 px-2">
            <p className="text-sm font-semibold text-[var(--color-text)]">AMASP Admin</p>
            <p className="text-xs text-[var(--color-text-faint)]">Keylog analytics</p>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-accent-bg)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 sm:px-6">
            <div className="text-sm font-medium text-[var(--color-text)] sm:hidden">AMASP Admin</div>
            <div className="hidden sm:block" />
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--color-text-muted)]">{session?.username}</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]"
              >
                Log out
              </button>
            </div>
          </header>
          <main className="flex-1 bg-[var(--color-bg)] p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
