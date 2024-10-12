import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APiError } from "../types/ApiError";
import { resetCart } from "./CartSlice";
import { AppDispatch } from "../store";
import apiClient from "../apiClient";

// Define the shape of your user state
interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface UserState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: APiError | null;
}

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
};

// Async thunk for user sign-in
export const signIn = createAsyncThunk<
  UserInfo,
  { email: string; password: string }
>("user/signIn", async (userData) => {
  const response = await apiClient.post("/api/users/signin", userData);
  return response.data; // Expecting the user object with token and role
});

// Async thunk for user sign-up
export const signUp = createAsyncThunk<
  UserInfo,
  { name: string; email: string; password: string }
>("user/signUp", async (userData) => {
  const response = await apiClient.post("/api/users/signup", userData);
  return response.data; // Expecting the user object with token and role
});
export const setUserFromLocalStorage = createAsyncThunk(
  "user/setUserFromLocalStorage",
  async () => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  }
);

// Create user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut(state) {
      state.userInfo = null;

      window.location.href = "/signin";
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle sign-in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Set user info on successful sign-in
        localStorage.setItem("userInfo", JSON.stringify(action.payload)); // Store user info in localStorage
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as APiError;
      }) // Casting the error to APIError
      // Handle sign-up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Set user info on successful sign-up
        localStorage.setItem("userInfo", JSON.stringify(action.payload)); // Store user info in localStorage
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as APiError;
      })
      .addCase(setUserFromLocalStorage.fulfilled, (state, action) => {
        state.userInfo = action.payload; // Set user info from local storage
      });
  },
});

// Export actions and reducer
export const { signOut } = userSlice.actions;
export default userSlice.reducer;

export const handleSignOut = () => (dispatch: AppDispatch) => {
  dispatch(signOut()); // Dispatch the signOut action
  dispatch(resetCart()); // Clear cart items and related data
  localStorage.removeItem("userInfo"); // Remove user info from localStorage
  window.location.href = "/signin"; // Redirect to sign-in page
};
