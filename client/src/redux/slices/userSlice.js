import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    setUserProfile(state, action) {
      state.profile = action.payload;
    },
    setWishlist(state, action) {
      state.wishlist = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUserProfile, setWishlist, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
