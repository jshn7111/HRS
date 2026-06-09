import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentStatus: null,
    paymentDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPaymentStatus(state, action) {
      state.paymentStatus = action.payload;
    },
    setPaymentDetails(state, action) {
      state.paymentDetails = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setPaymentStatus, setPaymentDetails, setLoading, setError } = paymentSlice.actions;
export default paymentSlice.reducer;
