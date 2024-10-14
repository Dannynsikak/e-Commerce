// src/components/PlaceOrder.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import { setShippingAddress } from "../slices/shippingSlice"; // Assuming you have the action set
import { createOrder } from "../slices/orderSlice"; // Assuming you have an order creation action
import { resetCart } from "../slices/CartSlice"; // Assuming you want to clear cart after placing order

const PlaceOrder: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  // Extract shipping address, cart items, payment method, etc., from the Redux store
  const { shippingAddress } = useSelector((state: RootState) => state.shipping);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { paymentMethod } = useSelector((state: RootState) => state.payment);
  const { userInfo } = useSelector((state: RootState) => state.user);

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example shipping logic
  const taxPrice = itemsPrice * 0.15; // Example tax rate
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Handle place order functionality
  const placeOrderHandler = async () => {
    if (!shippingAddress || !paymentMethod) {
      // If missing shipping address or payment method, redirect or alert the user
      alert("Please complete the shipping and payment details.");
      return;
    }

    // Dispatch action to create the order
    dispatch(
      createOrder({
        user: userInfo._id,
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );

    // Optionally, clear the cart after order is placed
    dispatch(resetCart());

    // Redirect to order confirmation page
    navigate("/order-confirmation");
  };

  // Load shipping address from localStorage if present
  useEffect(() => {
    if (!shippingAddress) {
      dispatch(
        setShippingAddress(
          JSON.parse(localStorage.getItem("shippingAddress") || "{}")
        )
      );
    }
  }, [dispatch, shippingAddress]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Place Order</h1>

      {/* Shipping Information */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Shipping</h2>
        {shippingAddress ? (
          <div>
            <p>
              <strong>Name: </strong> {shippingAddress.fullName}
            </p>
            <p>
              <strong>Address: </strong>{" "}
              {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
            </p>
          </div>
        ) : (
          <p>No shipping address provided.</p>
        )}
      </div>

      {/* Payment Information */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Payment Method</h2>
        <p>{paymentMethod || "No payment method selected."}</p>
      </div>

      {/* Order Summary */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <ul>
          <li>Items: ${itemsPrice.toFixed(2)}</li>
          <li>Shipping: ${shippingPrice.toFixed(2)}</li>
          <li>Tax: ${taxPrice.toFixed(2)}</li>
          <li>Total: ${totalPrice.toFixed(2)}</li>
        </ul>
      </div>

      {/* Place Order Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={placeOrderHandler}
      >
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrder;
