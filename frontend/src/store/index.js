import { configureStore } from '@reduxjs/toolkit';
import carReducer from './slices/carSlice';
import bookingReducer from './slices/bookingSlice';
import authContextReducer from './slices/authContextSlice';
import userContextReducer from './slices/userContextSlice';

export const store = configureStore({
  reducer: {
    cars: carReducer,
    bookings: bookingReducer,
    authContext: authContextReducer,
    userContext: userContextReducer,
  },
});

export default store;
