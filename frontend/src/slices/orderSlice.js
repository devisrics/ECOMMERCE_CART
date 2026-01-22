import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderDetail: {},
    userOrders: [],
    adminOrders: [],
    loading: false,
    isOrderDeleted: false,
    isOrderUpdated: false,
    error: null,
  },
  reducers: {
    // CREATE ORDER
    createOrderRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess(state, action) {
      state.loading = false;
      state.orderDetail = action.payload.order;
    },
    createOrderFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // USER ORDERS
    userOrdersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    userOrdersSuccess(state, action) {
      state.loading = false;
      state.userOrders = action.payload.orders;
    },
    userOrdersFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ORDER DETAILS
    orderDetailRequest(state) {
      state.loading = true;
      state.error = null;
    },
    orderDetailSuccess(state, action) {
      state.loading = false;
      state.orderDetail = action.payload.order;
    },
    orderDetailFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ADMIN ORDERS
    adminOrdersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    adminOrdersSuccess(state, action) {
      state.loading = false;
      state.adminOrders = action.payload.orders;
    },
    adminOrdersFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // DELETE ORDER
    deleteOrderRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteOrderSuccess(state) {
      state.loading = false;
      state.isOrderDeleted = true;
    },
    deleteOrderFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // UPDATE ORDER
    updateOrderRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateOrderSuccess(state) {
      state.loading = false;
      state.isOrderUpdated = true;
    },
    updateOrderFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // CLEAR FLAGS
    clearOrderDeleted(state) {
      state.isOrderDeleted = false;
    },
    clearOrderUpdated(state) {
      state.isOrderUpdated = false;
    },

    // CLEAR ERROR
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  createOrderFail,
  createOrderSuccess,
  createOrderRequest,
  clearError,
  userOrdersFail,
  userOrdersSuccess,
  userOrdersRequest,
  orderDetailFail,
  orderDetailSuccess,
  orderDetailRequest,
  adminOrdersFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  deleteOrderFail,
  deleteOrderRequest,
  deleteOrderSuccess,
  updateOrderFail,
  updateOrderRequest,
  updateOrderSuccess,
  clearOrderDeleted,
  clearOrderUpdated,
} = orderSlice.actions;

export default orderSlice.reducer;
