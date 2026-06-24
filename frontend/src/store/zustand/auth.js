import { create } from "zustand";

/* ───────────────────────────────────────────────
   API root & helper
   ─────────────────────────────────────────────── */
const API_ROOT = "http://localhost:5000/api";

const parseJSON = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || data?.errors || "Request failed");
  }
  return data;
};

/* ───────────────────────────────────────────────
   useAuthStore
   ───────────────────────────────────────────────
   State:
     - user            : currently logged-in user object (persisted in localStorage)
     - isAuthenticated : derived from token presence in localStorage
     - status          : 'idle' | 'loading' | 'failed'
     - error           : last error message or null
   Actions:
     - login(credentials)       → POST /auth/login
     - register(payload)        → POST /auth/register
     - logout()                 → clear auth state & localStorage
     - refreshUser()            → re-read user from localStorage
     - clearError()             → reset error to null
   ─────────────────────────────────────────────── */
const useAuthStore = create((set) => ({
  /* ── State ────────────────────────────────── */
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  isAuthenticated: !!localStorage.getItem("token"),
  status: "idle",
  error: null,

  /* ── Actions ──────────────────────────────── */

  /** Log the user in with email & password */
  login: async (credentials) => {
    set({ status: "loading", error: null });
    try {
      const response = await fetch(`${API_ROOT}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await parseJSON(response);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({
        user: data.user,
        isAuthenticated: true,
        status: "idle",
      });
      return data;
    } catch (error) {
      set({ status: "failed", error: error.message });
      throw error;
    }
  },

  /** Register a new user account */
  register: async (payload) => {
    set({ status: "loading", error: null });
    try {
      const response = await fetch(`${API_ROOT}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await parseJSON(response);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({
        user: data.user,
        isAuthenticated: true,
        status: "idle",
      });
      return data;
    } catch (error) {
      set({ status: "failed", error: error.message });
      throw error;
    }
  },

  /** Clear session and wipe localStorage */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false, status: "idle", error: null });
  },

  /** Re-sync user from localStorage (useful after profile update) */
  refreshUser: () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      set({ user: JSON.parse(savedUser) });
    }
  },

  /** Clear any stored error */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
