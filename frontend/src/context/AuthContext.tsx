import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getCurrentUserApi,
  loginApi,
  logoutApi,
  registerApi,
} from '../services/auth.service';
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth';
import { getToken } from '../utils/token';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getToken);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    logoutApi();
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    const loadCurrentUser = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUserApi();
        if (active) setUser(currentUser);
      } catch {
        if (active) logout();
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCurrentUser();
    return () => {
      active = false;
    };
  }, [logout]);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await loginApi(data);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response.user;
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await registerApi(data);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response.user;
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, loading, login, register, logout }),
    [user, accessToken, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
