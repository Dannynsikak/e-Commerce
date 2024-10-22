import express, { Request, Response } from "express";
import orderController from "../controller/order-Controller";
import { isAuth } from "../utils";

const orderRouter = express.Router();

orderRouter.get("/:id", isAuth, orderController.orderModelsById);

orderRouter.post("/", isAuth, orderController.orderModels);

orderRouter.put("/:id/pay", isAuth, orderController.orderModelsPay);

orderRouter.get("/", isAuth, orderController.getAllOrders);

//orderRouter.get("", isAuth, orderController.getAllProduct);

export default orderRouter;
