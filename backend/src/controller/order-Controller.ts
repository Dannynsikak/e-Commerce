import { Request, Response } from "express";
import { OrderModel } from "../models/orderModels";
import { Product } from "../models/ProductModel";

// get orders by id
const orderModelsById = async (req: Request, res: Response) => {
  const order = await OrderModel.findById(req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order Not Found" });
  }
};

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

const orderModelsPay = async (req: Request, res: Response) => {
  const order = await OrderModel.findById(req.params.id).populate("user");

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date(Date.now());
    order.paymentResult = {
      paymentId: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updateOrder = await order.save();

    res.send({ updateOrder, message: "Order Paid Successfully" });
  } else {
    res.status(404).json({ message: "Order Not Found" });
  }
};
const orderModelsController = {
  orderModels,
  orderModelsById,
  orderModelsPay,
};

export default orderModelsController;
