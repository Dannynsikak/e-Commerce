import { Request, Response } from "express";
import { OrderModel } from "../models/orderModels";
import { Product } from "../models/ProductModel";

// Function to handle order creation
const orderModels = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.orderItems || req.body.orderItems.length === 0) {
    res.status(400).json({ message: "Cart is Empty" });
    return;
  }

  try {
    const createOrder = await OrderModel.create({
      orderItems: req.body.orderItems.map((x: Product) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemPrice: req.body.itemPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Order created successfully",
      order: createOrder,
    });
  } catch (error) {
    const err = error as Error;

    console.error("Order creation error:", err.message);
    res.status(500).json({
      message: "Error creating order",
      error: err.message || "Internal Server Error",
    });
  }
};

const orderModelsController = {
  orderModels,
};

export default orderModelsController;
