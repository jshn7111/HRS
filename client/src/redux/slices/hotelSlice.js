import { createSlice } from '@reduxjs/toolkit';

const hotelSlice = createSlice({
  name: 'hotel',
  initialState: {
    hotels: [],
    selectedHotel: null,
    loading: false,
    error: null,
  },
  reducers: {
    setHotels(state, action) {
      state.hotels = action.payload;
    },
    setSelectedHotel(state, action) {
      state.selectedHotel = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setHotels, setSelectedHotel, setLoading, setError } = hotelSlice.actions;
export default hotelSlice.reducer;
