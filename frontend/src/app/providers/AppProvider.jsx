/**
 * AppProvider
 * -----------
 * Global state for auth (user + token).
 * Reads from localStorage on startup to restore session.
 * Auto-clears stale tokens if backend returns 401.
 */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getToken, getCurrentUser, logout as clearAuth } from "../../services/auth.service";
import { hydrateProgressFromBackend } from "../../services/progress.service";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser]           = useState(null);
  const [token, setToken]         = useState(null);
  const [authReady, setAuthReady] = useState(false); // don't render until auth is resolved
  const hydratedRef               = useRef(false);

  // Restore session from localStorage on app start
  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setToken(stored);
      setUser(getCurrentUser());
    }
    setAuthReady(true);
  }, []);

  // Once auth is confirmed, load progress from backend (only once per session)
  useEffect(() => {
    if (!authReady || !token || hydratedRef.current) return;
    hydratedRef.current = true;

    hydrateProgressFromBackend().catch((err) => {
      // Token was invalid — clear stale auth data
      if (err?.response?.status === 401) {
        clearAuth();
        setToken(null);
        setUser(null);
        hydratedRef.current = false;
      }
    });
  }, [authReady, token]);

  // Called after successful login / OTP verify / OAuth
  const login = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    hydratedRef.current = false; // allow re-hydration
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
    hydratedRef.current = false;
  };

  const value = {
    user,
    token,
    isLoggedIn: Boolean(user),
    login,
    logout,
  };

  // Don't render children until we know if user is logged in (prevents flash)
  return (
    <AppContext.Provider value={value}>
      {authReady ? children : null}
    </AppContext.Provider>
  );
};

// Custom hook — throws a helpful error if used outside provider
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
