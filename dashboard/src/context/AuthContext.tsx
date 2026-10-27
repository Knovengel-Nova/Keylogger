import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthSession {
  username: string;
}

interface AuthContextValue {
  session: AuthSession | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_STORAGE_KEY = 'amasp.mock-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const storedValue = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return storedValue ? (JSON.parse(storedValue) as AuthSession) : null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      login: (username: string) => {
        const newSession = { username };
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
        setSession(newSession);
      },
      logout: () => {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setSession(null);
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const authCtx = useContext(AuthContext);
  if (!authCtx) throw new Error('useAuth must be used within AuthProvider');
  return authCtx;
}
