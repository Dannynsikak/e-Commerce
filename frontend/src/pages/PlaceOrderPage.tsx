// src/components/PlaceOrder.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import { setShippingAddress } from "../slices/shippingSlice"; // Assuming you have the action set
import { createOrder } from "../slices/orderSlice"; // Assuming you have an order creation action
import { resetCart } from "../slices/CartSlice"; // Assuming you want to clear cart after placing order
import { Card, ListGroup, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

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
    if (!userInfo || !userInfo._id) {
      // If user is not logged in or userInfo is undefined, alert the user
      alert("User not logged in.");
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
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <h1 className="text-center mb-4">Place Order</h1>

      {/* Shipping Information */}
      <Card className="mb-4">
        <Card.Header as="h2">Shipping</Card.Header>
        <Card.Body>
          {shippingAddress ? (
            <div>
              <p>
                <strong>Name:</strong> {shippingAddress.fullName}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
              </p>
            </div>
          ) : (
            <p>No shipping address provided.</p>
          )}
        </Card.Body>
      </Card>

      {/* Payment Information */}
      <Card className="mb-4">
        <Card.Header as="h2">Payment Method</Card.Header>
        <Card.Body>
          <p>{paymentMethod || "No payment method selected."}</p>
        </Card.Body>
      </Card>

      {/* Order Summary */}
      <Card className="mb-4">
        <Card.Header as="h2">Order Summary</Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>Items: ${itemsPrice.toFixed(2)}</ListGroup.Item>
            <ListGroup.Item>
              Shipping: ${shippingPrice.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>Tax: ${taxPrice.toFixed(2)}</ListGroup.Item>
            <ListGroup.Item>Total: ${totalPrice.toFixed(2)}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Place Order Button */}
      <div className="text-center">
        <Button variant="primary" onClick={placeOrderHandler}>
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default PlaceOrder;
