import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/types";
import { loginApi } from "@/lib/api";

const SESSION_KEY = "prodex_user";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session dari sessionStorage saat app pertama load
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        setUser(parsed);
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<string | null> => {
      if (!username.trim() || !password) return "Username dan password wajib diisi.";

      try {
        const authUser = await loginApi(username.trim(), password);
        setUser(authUser);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
        return null; // sukses
      } catch {
        return "Username atau password salah.";
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
