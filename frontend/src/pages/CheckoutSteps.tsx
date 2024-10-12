import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";
import { Card, Col, ListGroup, Row } from "react-bootstrap";

const CheckoutSteps: React.FC = () => {
  const shippingAddress = useSelector(
    (state: RootState) => state.shipping.shippingAddress
  );
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  // Define boolean states for each step
  const isSignedIn = !!userInfo;
  const isShippingCompleted = !!shippingAddress;

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
              <Link to="/payment" className="text-decoration-none">
                Payment
              </Link>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to="/placeorder" className="text-decoration-none">
                Place Order
              </Link>
            </ListGroup.Item>
          </ListGroup>

          {/* Display shipping address if available */}
          {isShippingCompleted && (
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
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutSteps;
