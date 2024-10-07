import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ProductModel } from "../models/ProductModel";
import { sampleProducts } from "../data"; // Sample product data

const seedRouter = express.Router();

// Seed products
seedRouter.get(
  "/",
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      // Delete all existing products
      await ProductModel.deleteMany({});

      // Insert sample products
      const createdProducts = await ProductModel.insertMany(sampleProducts);

      // Send back the created products
      res.send({ createdProducts });
    } catch (error) {
      res.status(500).send({ message: "Failed to seed products", error });
    }
  })
);

export default seedRouter;
