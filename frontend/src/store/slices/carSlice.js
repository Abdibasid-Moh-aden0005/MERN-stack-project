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

export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiRequest(`/cars${queryString}`);
      return response.cars || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCarDetails = createAsyncThunk(
  'cars/fetchCarDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/cars/${id}`);
      return response.car || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewCar = createAsyncThunk(
  'cars/addNewCar',
  async ({ carData, images }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(carData).forEach(key => {
        if (key === 'features') {
          formData.append(key, JSON.stringify(carData[key]));
        } else {
          formData.append(key, carData[key]);
        }
      });

      if (images && images.length > 0) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await apiRequest('/cars', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': undefined,
        },
      });
      return response.car || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async ({ id, carData, newImages }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(carData).forEach(key => {
        if (key === 'features') {
          formData.append(key, JSON.stringify(carData[key]));
        } else {
          formData.append(key, carData[key]);
        }
      });

      if (newImages && newImages.length > 0) {
        newImages.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await apiRequest(`/cars/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': undefined,
        },
      });
      return { message: response.message, data: response.car };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest(`/cars/${id}`, { method: 'DELETE' });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const carSlice = createSlice({
  name: 'cars',
  initialState: {
    cars: [],
    selectedCar: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCarError: (state) => {
      state.error = null;
    },
    resetCarStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCarDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCarDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCar = action.payload;
      })
      .addCase(fetchCarDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNewCar.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewCar.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cars.push(action.payload);
      })
      .addCase(addNewCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter(car => car._id !== action.payload);
      })
      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cars = state.cars.map((car) => 
          car._id === action.payload.data._id ? action.payload.data : car
        );
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCarError, resetCarStatus } = carSlice.actions;
export default carSlice.reducer;

