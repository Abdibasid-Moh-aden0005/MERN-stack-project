import { create } from "zustand";

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
   useCarStore
   ───────────────────────────────────────────────
   State:
     - cars         : list of all cars
     - selectedCar  : currently selected / viewed car details
     - loading      : true while an async operation is in-flight
     - error        : last error message or null
     - success      : true after a successful create / update
   Actions:
     - fetchCars(filters?)               → GET /cars
     - fetchCarDetails(id)                → GET /cars/:id
     - addNewCar({carData, images})       → POST /cars  (multipart)
     - updateCar({id, carData, newImages}) → PUT /cars/:id (multipart)
     - deleteCar(id)                      → DELETE /cars/:id
     - clearCarError()                    → reset error to null
     - resetCarStatus()                   → reset success & error
   ─────────────────────────────────────────────── */
const useCarStore = create((set) => ({
  /* ── State ────────────────────────────────── */
  cars: [],
  selectedCar: null,
  loading: false,
  error: null,
  success: false,

  /* ── Actions ──────────────────────────────── */

  /** Fetch cars with optional query filters */
  fetchCars: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${API_ROOT}/cars${queryString}`);
      const data = await parseJSON(response);
      const cars = data.data;
      set({ cars, loading: false });
      return cars;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Fetch a single car's full details */
  fetchCarDetails: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_ROOT}/cars/${id}`);
      const data = await parseJSON(response);
      const car = data.car || data.data;
      set({ selectedCar: car, loading: false });
      return car;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Admin: add a new car (supports image upload via FormData) */
  addNewCar: async ({ carData, images }) => {
    set({ loading: true, error: null, success: false });
    try {
      const formData = new FormData();
      Object.keys(carData).forEach((key) => {
        if (key === "features") {
          formData.append(key, JSON.stringify(carData[key]));
        } else {
          formData.append(key, carData[key]);
        }
      });
      if (images && images.length > 0) {
        images.forEach((image) => formData.append("images", image));
      }
      const response = await fetch(`${API_ROOT}/cars`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await parseJSON(response);
      const car = data.car || data.data;
      set((state) => ({
        loading: false,
        success: true,
        cars: [...state.cars, car],
      }));
      return car;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Admin: update an existing car (supports new image upload) */
  updateCar: async ({ id, carData, newImages }) => {
    set({ loading: true, error: null, success: false });
    try {
      const formData = new FormData();
      Object.keys(carData).forEach((key) => {
        if (key === "features") {
          formData.append(key, JSON.stringify(carData[key]));
        } else {
          formData.append(key, carData[key]);
        }
      });
      if (newImages && newImages.length > 0) {
        newImages.forEach((image) => formData.append("images", image));
      }
      const response = await fetch(`${API_ROOT}/cars/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await parseJSON(response);
      const updatedCar = data.car || data.data;
      set((state) => ({
        loading: false,
        success: true,
        cars: state.cars.map((c) =>
          c._id === updatedCar._id ? updatedCar : c,
        ),
      }));
      return { message: data.message, data: updatedCar };
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Admin: delete a car */
  deleteCar: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_ROOT}/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await parseJSON(response);
      set((state) => ({
        loading: false,
        cars: state.cars.filter((car) => car._id !== id),
      }));
      return id;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  /** Clear only the error field */
  clearCarError: () => set({ error: null }),

  /** Reset success & error flags (after navigating away, etc.) */
  resetCarStatus: () => set({ success: false, error: null }),
}));

export default useCarStore;
