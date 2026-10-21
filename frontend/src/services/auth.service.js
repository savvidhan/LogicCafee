import api from "./api";

const AUTH_KEY = "auth";

const saveAuth = (authData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

const readAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/* ── OTP Registration (2-step) ── */

export const sendOTP = async (payload) => {
  const res = await api.post("/auth/register/send-otp", payload);
  return res.data;
};

export const verifyOTP = async (payload) => {
  const res = await api.post("/auth/register/verify-otp", payload);
  const authData = res.data?.data;
  if (!authData?.token) throw new Error("Invalid response");
  saveAuth(authData);
  return authData;
};

/* ── Local Login ── */

export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);
  const authData = res.data?.data;
  if (!authData?.token) throw new Error("Invalid login response");
  saveAuth(authData);
  return authData;
};

/* ── OAuth callback (called from /auth/callback page) ── */

export const handleOAuthCallback = ({ token, user }) => {
  const authData = { token, user };
  saveAuth(authData);
  return authData;
};

/* ── Session management ── */

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getToken = () => readAuth()?.token || null;

export const getCurrentUser = () => readAuth()?.user || null;

export const isAuthenticated = () => Boolean(getToken());
