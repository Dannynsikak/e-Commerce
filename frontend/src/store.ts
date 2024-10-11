// src/store.ts
import { configureStore, createSlice } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/CartSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import userReducer from "./slices/userSlice";
import shippingReducer from "./slices/shippingSlice";

// Define the shape of your app's state
type ModeState = {
  mode: "light" | "dark";
};

// Initial state for the mode
const initialState: ModeState = {
  mode:
    (localStorage.getItem("mode") as "light" | "dark") ||
    (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),
};

// Create a slice for the mode state
const modeSlice = createSlice({
  name: "mode",
  initialState,
  reducers: {
    switchMode(state) {
      const newMode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("mode", newMode);
      state.mode = newMode;
    },
  },
});

// Export actions generated by createSlice
export const { switchMode } = modeSlice.actions;

// Configure the Redux store
export const store = configureStore({
  reducer: {
    products: productReducer,
    mode: modeSlice.reducer,
    cart: cartReducer,
    user: userReducer,
    shipping: shippingReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Customize middleware if needed
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Define RootState type for usage in selectors
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
