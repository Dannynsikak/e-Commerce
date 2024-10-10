import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APiError } from "../types/ApiError";

interface UserState {
  userInfo: {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk(
  "user/signUp",
  async (
    userData: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post("/api/users/signup", userData);
      return response.data;
    } catch (error) {
      const apiError = error as APiError;
      return thunkAPI.rejectWithValue(
        apiError.response?.data?.message ||
          apiError.message ||
          "An error occurred during sign-up"
      );
    }
  }
);

const createNewUserSlice = createSlice({
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
      // Handle loading state
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful sign-up
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Set user info
        localStorage.setItem("userInfo", JSON.stringify(action.payload)); // Store user in localStorage
      })
      // Handle sign-up failure
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Store the error message
      });
  },
});

// Export actions and reducer
export const { signOut } = createNewUserSlice.actions;
export default createNewUserSlice.reducer;
