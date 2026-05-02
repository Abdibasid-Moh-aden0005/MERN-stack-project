import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };

  if (headers['Content-Type'] === undefined) {
    delete headers['Content-Type'];
  } else if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiRequest(`/bookings/my${queryString}`);
      return response.bookings || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewBooking = createAsyncThunk(
  'bookings/createNewBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      return response.booking || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'bookings/checkAvailability',
  async ({ carId, pickupDate, dropoffDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ carId, pickupDate, dropoffDate });
      const response = await apiRequest(`/bookings/check-availability?${params.toString()}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/bookings/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ cancellationReason: reason }),
      });
      return response.booking || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Admin Actions
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/admin/bookings');
      return response.bookings || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/admin/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return response.booking || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    success: false,
    availability: null,
  },
  reducers: {
    resetBookingState: (state) => {
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
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability = action.payload;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;


