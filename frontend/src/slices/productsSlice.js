import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  products: [],
  productsCount: 0,
  resPerPage: 0,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // ✅ Fetch products (all users)
    productsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    productsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.productsCount = action.payload.count;
      state.resPerPage = action.payload.resPerPage;
    },
    productsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ Fetch products (admin)
    adminProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
    },
    adminProductsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  productsRequest,
  productsSuccess,
  productsFail,
  adminProductsRequest,
  adminProductsSuccess,
  adminProductsFail,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
