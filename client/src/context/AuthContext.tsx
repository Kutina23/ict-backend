import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

// Set the base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "student" | "hod";
  indexNumber?: string;
  level?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  api: typeof api;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
      // Only test connection if no token (happens once)
      testConnectionOnce();
    }
  }, []);

  const testConnectionOnce = async () => {
    try {
      await api.get("/api/auth/me");
    } catch (error: any) {
      // Silent fail - 401 is expected without token
      if (error.response?.status !== 401) {
        console.warn("Backend server not reachable. Running in demo mode.");
      }
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      } else if (
        error.message.includes("ERR_CONNECTION_REFUSED") ||
        error.message.includes("ERR_NAME_NOT_RESOLVED")
      ) {
        // Silently handle offline mode
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (error: any) {
      if (error.message.includes("ERR_CONNECTION_REFUSED")) {
        throw new Error(
          "Cannot connect to backend server. Please ensure the server is running."
        );
      } else if (error.response) {
        throw new Error(error.response.data.message || "Login failed");
      } else {
        throw new Error("Network error occurred");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, api }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
