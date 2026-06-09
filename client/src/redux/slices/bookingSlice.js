import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    currentBooking: null,
    bookingHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentBooking(state, action) {
      state.currentBooking = action.payload;
    },
    setBookingHistory(state, action) {
      state.bookingHistory = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setCurrentBooking, setBookingHistory, setLoading, setError } = bookingSlice.actions;
export default bookingSlice.reducer;
