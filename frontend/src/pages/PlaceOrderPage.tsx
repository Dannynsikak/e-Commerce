import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store"; // Import your store's RootState
import { createOrder, resetOrder } from "../slices/orderSlice";
import { AppDispatch } from "../store"; // Your dispatch type
import { resetCart } from "../slices/CartSlice"; // Action to clear cart
import { toast } from "react-toastify";
import { APiError } from "../types/ApiError"; // Import your error type
import CheckoutSteps from "./CheckoutSteps";
import { Helmet } from "react-helmet-async";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

// Helper function to round numbers to two decimal places
const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;

// Type guard to check if error is of type APiError
const isApiError = (error: unknown): error is APiError => {
  if (typeof error === "object" && error !== null) {
    const e = error as APiError; // Cast to APiError for property checking
    return (
      typeof e.message === "string" &&
      typeof e.response === "object" &&
      e.response !== null &&
      typeof e.response.data === "object" &&
      e.response.data !== null &&
      typeof e.response.data.message === "string"
    );
  }
  return false;
};

const PlaceOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get cart information from the Redux store
  const { cart } = useSelector((state: RootState) => ({
    cart: state.cart,
  }));

  // Calculate prices using helper functions to avoid floating-point issues
  const itemsPrice = round2(
    cart.cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
  );
  const shippingPrice = itemsPrice > 100 ? round2(0) : round2(10); // Free shipping for orders over $100
  const taxPrice = round2(0.15 * itemsPrice); // 15% tax
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  // Function to handle placing the order
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  // After placing the order, navigate to the order details page and clear the cart
  useEffect(() => {
    if (cart.status === "succeeded") {
      // Display success toast notification
      toast.success("Order placed successfully!");
      if (cart.paymentMethod) {
        navigate("/payment");
      }
      // Use optional chaining when accessing cart.order
      if (cart.order?._id) {
        navigate(`/order/${cart.order._id}`);
      } else {
        toast.error("Order ID not found.");
      }
      localStorage.removeItem("cartItems");
      dispatch(resetCart());
      dispatch(resetOrder());
    } else if (cart.status === "failed" && cart.error) {
      // Use the type guard to check if cart.error is APiError
      if (isApiError(cart.error)) {
        const errorMessage = cart.error.response.data.message;
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.error("An unknown error occurred.");
      }

      dispatch(resetOrder());
    }
  }, [
    cart.status,
    cart.order,
    cart.paymentMethod,
    cart.error,
    navigate,
    dispatch,
  ]);

  return (
    <Container className="place-order-container mt-5">
      <CheckoutSteps />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <Card className="p-3">
        <Card.Header>
          <h3>Order Summary</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col xs={6}>Items:</Col>
            <Col xs={6}>${itemsPrice}</Col>
          </Row>
          <Row>
            <Col xs={6}>Shipping:</Col>
            <Col xs={6}>${shippingPrice}</Col>
          </Row>
          <Row>
            <Col xs={6}>Tax:</Col>
            <Col xs={6}>${taxPrice}</Col>
          </Row>
          <Row>
            <Col xs={6}>
              <strong>Total:</strong>
            </Col>
            <Col xs={6}>
              <strong>${totalPrice}</strong>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0 || cart.status === "loading"}
            className="w-100"
          >
            {cart.status === "loading" ? "Placing Order..." : "Place Order"}
          </Button>
          {cart.error && <p className="text-danger mt-2">{cart.error}</p>}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default PlaceOrderPage;
