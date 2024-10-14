import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderById, resetOrder } from "../slices/orderSlice";
import { RootState, AppDispatch } from "../store"; // Adjust based on your store setup
// import { Order } from "../types/order";

const OrderPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { orderId } = useParams<{ orderId: string }>(); // Get orderId from URL params

  // Select order state from Redux store
  const { order, status, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    // Fetch order details by ID when the component mounts
    if (orderId) {
      dispatch(getOrderById(orderId));
    }

    // Clean up function to reset order state
    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch, orderId]);

  // Render loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Render error state
  if (status === "failed" && error) {
    return <div>Error: {error.message || "Failed to load order."}</div>;
  }

  // Render order details
  if (status === "succeeded" && order) {
    return (
      <div>
        <h1>Order Details</h1>
        <div>
          <h2>Order ID: {order._id}</h2>
          <h3>Customer Information</h3>
          {order.shippingAddress && (
            <div>
              <p>Full Name: {order.shippingAddress.fullName}</p>
              <p>
                Address: {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
              <p>Postal Code: {order.shippingAddress.postalCode}</p>
            </div>
          )}
          <h3>Items Ordered</h3>
          {order.orderItems.map((item) => (
            <div key={item._id}>
              <img src={item.image} alt={item.name} className="img-fluid" />
              <p>Name: {item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}
          <h3>Payment Method: {order.paymentMethod}</h3>
          <h3>Total Price: ${order.totalPrice}</h3>
          <h3>Status:</h3>
          <p>
            {order.isPaid ? "Paid" : "Not Paid"}{" "}
            {order.paidAt && `on ${order.paidAt}`}
          </p>
          <p>
            {order.isDelivered ? "Delivered" : "Not Delivered"}{" "}
            {order.deliveredAt && `on ${order.deliveredAt}`}
          </p>
        </div>
      </div>
    );
  }

  // Default return
  return null;
};

export default OrderPage;
