import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store"; // Import your store's RootState
import { createOrder, resetOrder } from "../slices/orderSlice";
import { AppDispatch } from "../store"; // Your dispatch type
import { resetCart } from "../slices/CartSlice"; // Action to clear cart
import { toast } from "react-toastify";
import { APiError } from "../types/ApiError"; // Import your error type
import CheckoutSteps from "./CheckoutSteps";
import { Helmet } from "react-helmet-async";
import { Card, Button, ListGroup, Row, Col } from "react-bootstrap";

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
  const placeOrderHandler = async () => {
    try {
      // Dispatch the createOrder action with the order data (example with Redux)
      const orderData = {
        // assuming you have this data ready from your state
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      };

      await dispatch(createOrder(orderData)); // Dispatching Redux action
    } catch (error) {
      console.error("Error placing order:", error);
    }
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
    <>
      <CheckoutSteps />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>

      <h1 className="my-4">Preview Order</h1>

      {/* Wrapping content inside a Bootstrap row */}
      <Row>
        <Col md={8}>
          {/* Shipping Information */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {cart.shippingAddress?.fullName} <br />
                <strong>Address:</strong> {cart.shippingAddress?.address},{" "}
                {cart.shippingAddress?.city}, {cart.shippingAddress?.postalCode}
                , {cart.shippingAddress?.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          {/* Payment Information */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          {/* Cart Items */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded thumbnail me-2"
                        />
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit</Link>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>

              <ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    onClick={placeOrderHandler}
                    disabled={cart.cartItems.length === 0}
                    className="btn btn-primary"
                  >
                    Place Order
                  </Button>
                </div>
              </ListGroup.Item>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderPage;
