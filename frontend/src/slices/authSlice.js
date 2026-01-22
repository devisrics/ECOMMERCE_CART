import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  error: null,
  isUpdated: false,
  isPasswordReset: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN
    loginRequest: (state) => { state.loading = true; },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // REGISTER
    registerRequest: (state) => { state.loading = true; },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // LOAD USER
    loadUserRequest: (state) => { state.loading = true; },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loadUserFail: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    // LOGOUT
    logoutSuccess: (state) => Object.assign(state, initialState),
    logoutFail: (state, action) => { state.error = action.payload; },

    // UPDATE PROFILE
    updateProfileRequest: (state) => {
      state.loading = true;
      state.isUpdated = false;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isUpdated = true;
    },
    updateProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearUpdateProfile: (state) => { state.isUpdated = false; },

    // UPDATE PASSWORD
    updatePasswordRequest: (state) => {
      state.loading = true;
      state.isUpdated = false;
    },
    updatePasswordSuccess: (state) => {
      state.loading = false;
      state.isUpdated = true;
    },
    updatePasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // FORGOT PASSWORD
    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    forgotPasswordSuccess: (state) => { state.loading = false; },
    forgotPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // RESET PASSWORD
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.loading = false;
      state.isPasswordReset = true;
    },
    resetPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CLEARERS
    clearAuthError: (state) => { state.error = null; },
    clearPasswordReset: (state) => { state.isPasswordReset = false; },

    // RESET ENTIRE AUTH STATE
    resetAuthState: (state) => Object.assign(state, initialState),
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  clearUpdateProfile,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  clearAuthError,
  clearPasswordReset,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
