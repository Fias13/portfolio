import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/api/resources";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
}

interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("admin_token");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user: loggedInUser } = await authApi.login(email, password);
    localStorage.setItem("admin_token", token);
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
    window.location.href = "/admin/login";
  };

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
