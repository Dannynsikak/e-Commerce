import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import ProductItem from "./ProductItem";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("ProductItem Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      productSlice: {
        products: [
          {
            _id: "1",
            name: "Test Product",
            slug: "test-product",
            image: "test-image.jpg",
            rating: 4.5,
            numReviews: 10,
            price: 100,
            countInStock: 5,
          },
        ],
        loading: false,
        error: null,
      },
    });
  });
});
