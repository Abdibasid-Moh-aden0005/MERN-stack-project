import { create } from "zustand";

/* ───────────────────────────────────────────────
   API root & helpers
   ─────────────────────────────────────────────── */
const API_ROOT = "/api";

const parseJSON = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = Array.isArray(data?.errors) ? `: ${data.errors.join(", ")}` : "";
    throw new Error(`${data?.message || "Request failed"}${details}`);
  }
  return data;
};

const getToken = () => localStorage.getItem("token");

/* ───────────────────────────────────────────────
   useBookingStore
   ───────────────────────────────────────────────
   State:
     - bookings        : list of user / admin bookings
     - currentBooking  : the most recently created booking
     - loading         : true while an async operation is in-flight
     - error           : last error message or null
     - success         : true after a successful create
     - availability    : availability-check result object
   Actions:
     - fetchMyBookings(filters?)     → GET /bookings/my
     - createNewBooking(data)         → POST /bookings
     - checkAvailability({carId, …}) → GET /bookings/check-availability
     - cancelBooking({id, reason})    → PUT /bookings/:id/cancel
     - fetchAllBookings()             → GET /admin/bookings
     - updateBookingStatus({id, …})   → PUT /admin/bookings/:id/status
     - resetBookingState()            → reset transient fields
   ─────────────────────────────────────────────── */
const useBookingStore = create((set) => ({
  /* ── State ────────────────────────────────── */
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  success: false,
  availability: null,

  /* ── Actions ──────────────────────────────── */

  /** Fetch bookings belonging to the current user (optional filters) */
  fetchMyBookings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${API_ROOT}/bookings/my${queryString}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await parseJSON(response);
      const bookings = data.data;
      set({ bookings, loading: false });
      return bookings;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Create a new booking */
  createNewBooking: async (bookingData) => {
    set({ loading: true, error: null, success: false });
    try {
      const response = await fetch(`${API_ROOT}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(bookingData),
      });
      const data = await parseJSON(response);
      const booking = data.booking || data.data;
      set({ loading: false, success: true, currentBooking: booking });
      return booking;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Check car availability for given dates */
  checkAvailability: async ({ carId, pickupDate, dropoffDate }) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ carId, pickupDate, dropoffDate });
      const response = await fetch(
        `${API_ROOT}/bookings/check-availability?${params.toString()}`,
      );
      const data = await parseJSON(response);
      set({ loading: false, availability: data });
      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Cancel an existing booking */
  cancelBooking: async ({ id, reason }) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_ROOT}/bookings/${id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ cancellationReason: reason }),
      });
      const data = await parseJSON(response);
      const updated = data.booking || data.data;
      set((state) => ({
        loading: false,
        bookings: state.bookings.map((b) =>
          b._id === updated._id ? updated : b,
        ),
      }));
      return { booking: updated, refund: data.refund, message: data.message };
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Admin: fetch all bookings across users */
  fetchAllBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_ROOT}/admin/bookings`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await parseJSON(response);
      const bookings = data.data;
      set({ bookings, loading: false });
      return bookings;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Admin: update a booking's status */
  updateBookingStatus: async ({ id, status, adminNotes }) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_ROOT}/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status, adminNotes }),
      });
      const data = await parseJSON(response);
      const updated = data.booking || data.data;
      set((state) => ({
        loading: false,
        bookings: state.bookings.map((b) =>
          b._id === updated._id ? updated : b,
        ),
      }));
      return { booking: updated, message: data.message };
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Reset transient state fields */
  resetBookingState: () => {
    set({ loading: false, error: null, success: false, availability: null });
  },
}));

export default useBookingStore;
