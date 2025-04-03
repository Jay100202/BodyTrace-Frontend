import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  isLoggedIn: false,
  imei: null, // Add IMEI to the initial state
  type: '', // Add type to the initial state
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      state.imei = action.payload.imei || null; // Conditionally store IMEI or set to null
      state.type = action.payload.type || ''; // Conditionally store type or set to an empty string
    },
    clearUser(state) {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
      state.imei = null; // Clear IMEI on logout
      state.type = ''; // Clear type on logout
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;