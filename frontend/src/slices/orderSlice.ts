import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../apiClient"; // Assuming apiClient is set up to handle API requests
import { Order } from "../types/order"; // Import the Order type

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order: Order) => {
    const { data } = await apiClient.post<{ message: string; order: Order }>(
      "api/orders",
      order
    );
    return data.order;
  }
);

// Initial state
interface OrderState {
  order: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  status: "idle",
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create order";
      });
  },
});

// Action to reset order state
export const { resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
