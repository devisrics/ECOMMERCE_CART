import {
  loginFail,
  loginRequest,
  loginSuccess,
  clearAuthError,
  registerFail,
  registerRequest,
  registerSuccess,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail
} from '../slices/authSlice';

import {
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
  updateUserFail
} from '../slices/userSlice';

import { clearCart } from "../slices/cartSlice";
import axios from 'axios';

// Set your backend base URL
const BASE_URL = "http://13.61.11.157:8000/api/v1";

// ✅ Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${BASE_URL}/login`,
      { email, password },
      config
    );

    dispatch(clearCart());
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingInfo");
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || error.message));
  }
};

// ✅ Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
    const { data } = await axios.post(`${BASE_URL}/register`, userData, config);
    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFail(error.response?.data?.message || error.message));
  }
};

// ✅ Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());
    const { data } = await axios.get(`${BASE_URL}/myprofile`, { withCredentials: true });
    dispatch(loadUserSuccess(data));
  } catch (error) {
    dispatch(loadUserFail(error.response?.data?.message || error.message));
  }
};

// ✅ Logout
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
    dispatch(logoutSuccess());
    dispatch(clearCart());
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingInfo");
  } catch (error) {
    dispatch(logoutFail(error.response?.data?.message || error.message));
  }
};

// ✅ Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());
    const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
    const { data } = await axios.put(`${BASE_URL}/update`, userData, config);
    dispatch(updateProfileSuccess(data));
  } catch (error) {
    dispatch(updateProfileFail(error.response?.data?.message || error.message));
  }
};

// ✅ Update Password
export const updatePassword = (formData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());
    const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
    await axios.put(`${BASE_URL}/password/change`, formData, config);
    dispatch(updatePasswordSuccess());
  } catch (error) {
    dispatch(updatePasswordFail(error.response?.data?.message || error.message));
  }
};

// ✅ Forgot Password
export const forgotPassword = (formData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
    const { data } = await axios.post(`${BASE_URL}/password/forgot`, formData, config);
    dispatch(forgotPasswordSuccess(data.message));
  } catch (error) {
    dispatch(forgotPasswordFail(error.response?.data?.message || error.message));
  }
};

// ✅ Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
    const { data } = await axios.put(`${BASE_URL}/password/reset/${token}`, passwords, config);
    dispatch(resetPasswordSuccess(data.success));
  } catch (error) {
    dispatch(resetPasswordFail(error.response?.data?.message || 'Password reset failed'));
  }
};

// ✅ Admin: Get all users
export const getUsers = async (dispatch) => {
  try {
    dispatch(usersRequest());
    const { data } = await axios.get(`${BASE_URL}/admin/users`, { withCredentials: true });
    dispatch(usersSuccess(data));
  } catch (error) {
    dispatch(usersFail(error.response?.data?.message || error.message));
  }
};

// ✅ Admin: Get single user
export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await axios.get(`${BASE_URL}/admin/user/${id}`, { withCredentials: true });
    dispatch(userSuccess(data));
  } catch (error) {
    dispatch(userFail(error.response?.data?.message || error.message));
  }
};

// ✅ Admin: Delete user
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserRequest());
    await axios.delete(`${BASE_URL}/admin/user/${id}`, { withCredentials: true });
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(deleteUserFail(error.response?.data?.message || error.message));
  }
};

// ✅ Admin: Update user
export const updateUser = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateUserRequest());
    const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
    await axios.put(`${BASE_URL}/admin/user/${id}`, formData, config);
    dispatch(updateUserSuccess());
  } catch (error) {
    dispatch(updateUserFail(error.response?.data?.message || error.message));
  }
};
