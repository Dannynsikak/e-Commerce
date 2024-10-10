import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state of the user
interface UserState {
  userInfo: {
    name: string;
    email: string;
    role: string;
    token: string;
  } | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
};

// Async thunk for user sign-in
export const signIn = createAsyncThunk(
  "user/signIn",
  async (userData: { email: string; password: string }) => {
    const response = await axios.post("/api/users/signin", userData);
    return response.data; // Expecting the user object with token and role
  }
);

// Create user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut(state) {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
      localStorage.removeItem("cartItems");
      window.location.href = "/signin";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Set user info on successful sign in
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to sign in";
      });
  },
});

// Export actions and reducer
export const { signOut } = userSlice.actions;
export default userSlice.reducer;
