import { configureStore } from '@reduxjs/toolkit';
import carReducer from './slices/carSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    cars: carReducer,
    bookings: bookingReducer,
  },
});

export default store;
