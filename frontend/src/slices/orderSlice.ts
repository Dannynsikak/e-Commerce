import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../apiClient"; // Assuming apiClient is set up to handle API requests
import { Order } from "../types/order"; // Import the Order type
import { APiError } from "../types/ApiError";
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

// Async thunk for getting an order by ID
export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId: string) => {
    const { data } = await apiClient.get<{ message: string; order: Order }>(
      `api/orders/${orderId}`
    );
    return data.order;
  }
);

// export const payOrder = createAsyncThunk(
//   "order/payorder",
//   async (orderId: string) => {
//     const { data } = await apiClient.post<{ message: string; order: Order }>(
//       `api/orders/${orderId}/pay`,
//       orderId
//     );
//     return data;
//   }
// );

// Initial state
interface OrderState {
  order: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: APiError | null;
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
        state.error = (action.error as APiError) || "Failed to create order";
      })
      .addCase(getOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.status = "succeeded";
          state.order = action.payload;
        }
      )
      .addCase(getOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.error as APiError) || "Failed to fetch order";
      });
    // .addCase(payOrder.pending, (state) => {
    //   state.status = "loading";
    // })
    // .addCase(payOrder.fulfilled, (state, action) => {
    //   state.status = "succeeded";
    //   state.order = action.payload.order;
    // })
    // .addCase(payOrder.rejected, (state, action) => {
    //   state.status = "failed";
    //   state.error = (action.error as APiError) || "Failed to put PayOrder";
    // });
  },
});

// Action to reset order state
export const { resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
