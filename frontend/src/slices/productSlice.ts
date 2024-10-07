// src/slices/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, ProductState } from "../types/Product";
import { RootState } from "../store";
import { APiError } from "../types/ApiError";
import { getError } from "../utils";

// Fetch products using createAsyncThunk
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/products");
    return data;
  } catch (err) {
    return rejectWithValue(getError(err as APiError));
  }
});

// Fetch product details by slug using createAsyncThunk
export const fetchProductDetailsBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchDetails", async (slug, { rejectWithValue }) => {
  try {
    console.log("Fetching URL:", `/api/products/slug/${slug}`);
    const { data } = await axios.get(
      `http://localhost:4000/api/products/slug/${slug}`
    );
    return data;
  } catch (err) {
    return rejectWithValue(getError(err as APiError));
  }
});

// Initial state
const initialState: ProductState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload; // Store fetched products
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products.";
      });

    // Handle fetching product details by slug
    builder
      .addCase(fetchProductDetailsBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetails = null; // Reset productDetails when loading starts
      })
      .addCase(fetchProductDetailsBySlug.fulfilled, (state, action) => {
        state.productDetails = action.payload; // Store the fetched product details
        state.loading = false;
      })
      .addCase(fetchProductDetailsBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product details.";
      });
  },
});

// Selectors to get product data
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductDetails = (state: RootState) =>
  state.products.productDetails;
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;

export default productSlice.reducer;
