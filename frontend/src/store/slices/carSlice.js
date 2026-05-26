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

export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${API_ROOT}/cars${queryString}`);
      const data = await parseJSON(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchCarDetails = createAsyncThunk(
  "cars/fetchCarDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ROOT}/cars/${id}`);
      const data = await parseJSON(response);
      return data.car || data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addNewCar = createAsyncThunk(
  "cars/addNewCar",
  async ({ carData, images }, { rejectWithValue }) => {
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
        images.forEach((image) => {
          formData.append("images", image);
        });
      }
      const response = await fetch(`${API_ROOT}/cars`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await parseJSON(response);
      return data.car || data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async ({ id, carData, newImages }, { rejectWithValue }) => {
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
        newImages.forEach((image) => {
          formData.append("images", image);
        });
      }
      const response = await fetch(`${API_ROOT}/cars/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await parseJSON(response);
      return { message: data.message, data: data.car };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCar = createAsyncThunk(
  "cars/deleteCar",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ROOT}/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await parseJSON(response);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const carSlice = createSlice({
  name: "cars",
  initialState: {
    cars: [],
    selectedCar: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearCarError(state) {
      state.error = null;
    },
    resetCarStatus(state) {
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
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.filter((car) => car._id !== action.payload);
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cars = state.cars.map((car) =>
          car._id === action.payload.data._id ? action.payload.data : car,
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
