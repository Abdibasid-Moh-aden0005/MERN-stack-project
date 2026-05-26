import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_ROOT = "http://localhost:5000/api";

const parseJSON = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
};

const getToken = () => localStorage.getItem("token");

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMyBookings",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(
        `${API_ROOT}/bookings/my${queryString}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      const data = await parseJSON(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createNewBooking = createAsyncThunk(
  "bookings/createNewBooking",
  async (bookingData, { rejectWithValue }) => {
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
      return data.booking || data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const checkAvailability = createAsyncThunk(
  "bookings/checkAvailability",
  async ({ carId, pickupDate, dropoffDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ carId, pickupDate, dropoffDate });
      const response = await fetch(
        `${API_ROOT}/bookings/check-availability?${params.toString()}`,
      );
      const data = await parseJSON(response);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async ({ id, reason }, { rejectWithValue }) => {
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
      return data.booking || data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ROOT}/admin/bookings`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await parseJSON(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ROOT}/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await parseJSON(response);
      return data.booking || data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    success: false,
    availability: null,
  },
  reducers: {
    resetBookingState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.availability = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentBooking = action.payload;
      })
      .addCase(createNewBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (b) => b._id === action.payload._id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
