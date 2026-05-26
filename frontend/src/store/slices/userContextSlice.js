import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { refreshUser } from "./authContextSlice";

const API_ROOT = "http://localhost:5000/api";

const parseJSON = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
};

const getToken = () => localStorage.getItem("token");

export const fetchUsers = createAsyncThunk(
  "userContext/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ROOT}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await parseJSON(response);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "userContext/updateProfile",
  async (userData, { dispatch, rejectWithValue }) => {
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
        dispatch(refreshUser());
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "userContext/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_ROOT}/admin/users/${id}`, {
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

export const adminUpdateUser = createAsyncThunk(
  "userContext/adminUpdateUser",
  async ({ id, userData }, { rejectWithValue }) => {
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
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const adminAddUser = createAsyncThunk(
  "userContext/adminAddUser",
  async (userData, { rejectWithValue }) => {
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
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const userContextSlice = createSlice({
  name: "userContext",
  initialState: {
    users: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status = "idle";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.status = "idle";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(adminUpdateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminUpdateUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u._id === action.payload.user._id ? action.payload.user : u,
        );
        state.status = "idle";
      })
      .addCase(adminUpdateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(adminAddUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminAddUser.fulfilled, (state, action) => {
        state.users = [action.payload.user, ...state.users];
        state.status = "idle";
      })
      .addCase(adminAddUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = userContextSlice.actions;
export default userContextSlice.reducer;
