import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";
import { Col, ListGroup, Row } from "react-bootstrap";

const CheckoutSteps: React.FC = () => {
  const shippingAddress = useSelector(
    (state: RootState) => state.shipping.shippingAddress
  );
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const paymentMethod = useSelector(
    (state: RootState) => state.payment.paymentMethod
  );
  const order = useSelector((state: RootState) => state.order.order);
  // const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  // const itemsPrice = useSelector((state: RootState) => state.cart.itemsPrice);
  // const shippingPrice = useSelector(
  //   (state: RootState) => state.cart.shippingPrice
  // );
  // const taxPrice = useSelector((state: RootState) => state.cart.taxPrice);
  // const totalPrice = useSelector((state: RootState) => state.cart.totalPrice);

  // Define boolean states for each step
  const isSignedIn = !!userInfo;
  const isShippingCompleted = !!shippingAddress;
  const isPaymentCompleted = !!paymentMethod;
  const isOrderCompleted = !!order;

  return (
    <div className="container mt-4">
      <h2 className="text-center">Checkout Steps</h2>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {isSignedIn ? (
                <span className="text-success">Signed In</span>
              ) : (
                <Link to="/login" className="text-decoration-none">
                  Sign In
                </Link>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {isShippingCompleted ? (
                <span className="text-success">Shipping Completed</span>
              ) : (
                <Link to="/shipping" className="text-decoration-none">
                  Shipping
                </Link>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {isPaymentCompleted ? (
                <span className="text-success">Payment Method Selected</span>
              ) : (
                <Link to="/payment" className="text-decoration-none">
                  Payment
                </Link>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {isOrderCompleted ? (
                <span className="text-success">Order Completed</span>
              ) : (
                <Link to="/placeorder" className="text-decoration-none">
                  Place Order
                </Link>
              )}
            </ListGroup.Item>
          </ListGroup>

          {/* Display shipping address if available */}
          {/* {isShippingCompleted && (
            <div className="mt-4">
              <h4>Shipping Address:</h4>
              <Card className="mt-2">
                <Card.Body>
                  <Card.Title>{shippingAddress.fullName}</Card.Title>
                  <Card.Text>
                    {shippingAddress.address}
                    <br />
                    {shippingAddress.city}, {shippingAddress.country}{" "}
                    {shippingAddress.postalCode}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          )} */}

          {/* Render Cart Items */}
          {/* {cartItems.length > 0 && (
            <div className="mt-4">
              <h4>Items in Cart:</h4>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col md={8}>{item.name}</Col>
                      <Col md={4}>
                        ${item.price} x {item.quantity}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )} */}

          {/* Render Order Summary */}
          {/* <div className="mt-4">
            <h4>Order Summary:</h4>
            <Card className="mt-2">
              <Card.Body>
                <Card.Text>
                  <strong>Items Price:</strong> ${itemsPrice.toFixed(2)}
                  <br />
                  <strong>Shipping Price:</strong> ${shippingPrice.toFixed(2)}
                  <br />
                  <strong>Tax Price:</strong> ${taxPrice.toFixed(2)}
                  <br />
                  <hr />
                  <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </div> */}
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutSteps;
