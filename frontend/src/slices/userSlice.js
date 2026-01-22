import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: null,
  users: [],
  isUserUpdated: false,
  isUserDeleted: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    usersRequest(state) {
      state.loading = true;
    },
    usersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload.users;
    },
    usersFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    userRequest(state) {
      state.loading = true;
    },
    userSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
    },
    userFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteUserRequest(state) {
      state.loading = true;
    },
    deleteUserSuccess(state) {
      state.loading = false;
      state.isUserDeleted = true;
    },
    deleteUserFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updateUserRequest(state) {
      state.loading = true;
    },
    updateUserSuccess(state) {
      state.loading = false;
      state.isUserUpdated = true;
    },
    updateUserFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearUserDeleted(state) {
      state.isUserDeleted = false;
    },
    clearUserUpdated(state) {
      state.isUserUpdated = false;
    },
    clearError(state) {
      state.error = null;
    },

    resetUserState() {
      return initialState;
    }
  }
});

export const {
  usersRequest,
  usersSuccess,
  usersFail,
  userRequest,
  userSuccess,
  userFail,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFail,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
  clearUserDeleted,
  clearUserUpdated,
  clearError,
  resetUserState
} = userSlice.actions;

export default userSlice.reducer;
 