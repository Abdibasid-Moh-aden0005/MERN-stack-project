import { create } from "zustand";
import useAuthStore from "./auth";

/* ───────────────────────────────────────────────
   API root & helpers
   ─────────────────────────────────────────────── */
const API_ROOT = "http://localhost:5000/api";

const parseJSON = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
};

const getToken = () => localStorage.getItem("token");

/* ───────────────────────────────────────────────
   useUserStore
   ───────────────────────────────────────────────
   State:
     - users   : list of all users (admin view)
     - status  : 'idle' | 'loading' | 'failed'
     - error   : last error message or null
   Actions:
     - fetchUsers()                      → GET /admin/users
     - updateProfile(userData)           → PUT /auth/profile
     - deleteUser(id)                    → DELETE /admin/users/:id
     - adminUpdateUser({id, userData})   → PUT /admin/users/:id
     - adminAddUser(userData)            → POST /admin/users
     - clearError()                      → reset error to null
   ─────────────────────────────────────────────── */
const useUserStore = create((set) => ({
  /* ── State ────────────────────────────────── */
  users: [],
  status: "idle",
  error: null,

  /* ── Actions ──────────────────────────────── */

  /** Admin: fetch all users */
  fetchUsers: async () => {
    set({ status: "loading", error: null });
    try {
      const response = await fetch(`${API_ROOT}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await parseJSON(response);
      const users = data.data;
      set({ users, status: "idle" });
      return users;
    } catch (error) {
      set({ status: "failed", error: error.message });
      throw error;
    }
  },

  /** Update the current user's profile (syncs auth store & localStorage) */
  updateProfile: async (userData) => {
    set({ status: "loading", error: null });
    try {
      const response = await fetch(`${API_ROOT}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await parseJSON(response);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Re-sync the auth store so the sidebar / nav reflects the changes
        useAuthStore.getState().refreshUser();
      }
      set({ status: "idle" });
      return data;
    } catch (error) {
      set({ status: "failed", error: error.message });
      throw error;
    }
  },

  /** Admin: delete a user by id */
  deleteUser: async (id) => {
    set({ status: "loading", error: null });
    try {
      const response = await fetch(`${API_ROOT}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await parseJSON(response);
      set((state) => ({
        status: "idle",
        users: state.users.filter((u) => u._id !== id),
      }));
      return id;
    } catch (error) {
      set({ status: "failed", error: error.message });
      throw error;
    }
  },

  /** Admin: update any user's details */
  adminUpdateUser: async ({ id, userData }) => {
    set({ status: "loading", error: null });
    try {
      const response = await fetch(`${API_ROOT}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await parseJSON(response);
      set((state) => ({
        status: "idle",
        users: state.users.map((u) =>
          u._id === data.user._id ? data.user : u,
        ),
      }));
      return data;
    } catch (error) {
      set({ status: "failed", error: error.message });
      throw error;
    }
  },

  /** Admin: add a new user manually */
  adminAddUser: async (userData) => {
    set({ status: "loading", error: null });
    try {
      const response = await fetch(`${API_ROOT}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await parseJSON(response);
      set((state) => ({
        status: "idle",
        users: [data.user, ...state.users],
      }));
      return data;
    } catch (error) {
      set({ status: "failed", error: error.message });
      throw error;
    }
  },

  /** Clear any stored error */
  clearError: () => set({ error: null }),
}));

export default useUserStore;
