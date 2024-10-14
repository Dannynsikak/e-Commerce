import express, { Request, Response } from "express";
import orderController from "../controller/order-Controller";
import { isAuth } from "../utils";

const orderRouter = express.Router();

orderRouter.get("/:id", isAuth, orderController.orderModelsById);

orderRouter.post("/", isAuth, orderController.orderModels);

//orderRouter.get("", isAuth, orderController.getAllProduct);

export default orderRouter;
