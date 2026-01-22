import { createSlice } from "@reduxjs/toolkit";

// Initial state with localStorage fallback
const initialState = {
  items: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  loading: false,
  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ADD ITEM
    addCartItemRequest(state) {
      state.loading = true;
    },
    addCartItemSuccess(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.product === newItem.product);

      if (existingItem) {
        // Update quantity safely
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }

      state.loading = false;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // INCREASE ITEM QUANTITY
    increaseCartItemQty(state, action) {
      const item = state.items.find((i) => i.product === action.payload);
      if (item) {
        item.quantity += 1;
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    // DECREASE ITEM QUANTITY
    decreaseCartItemQty(state, action) {
      const item = state.items.find((i) => i.product === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    // REMOVE ITEM
    removeItemFromCart(state, action) {
      state.items = state.items.filter((i) => i.product !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // SAVE SHIPPING INFO
    saveShippingInfo(state, action) {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },

    // ORDER COMPLETED → CLEAR CART & STORAGE
    orderCompleted(state) {
      state.items = [];
      state.shippingInfo = {};
      state.loading = false;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingInfo");
      sessionStorage.removeItem("orderInfo");
    },

    // CLEAR CART MANUALLY
    clearCart(state) {
      state.items = [];
      state.shippingInfo = {};
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingInfo");
    },
  },
});

export const {
  addCartItemRequest,
  addCartItemSuccess,
  increaseCartItemQty,
  decreaseCartItemQty,
  removeItemFromCart,
  saveShippingInfo,
  orderCompleted,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
