import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ProductModel } from "../models/ProductModel";
import { sampleProducts, sampleUsers } from "../data"; // Sample product data
import { User, UserModel } from "../models/userModel";

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
      // delete all existing users
      await UserModel.deleteMany({});

      // Insert sample users
      const createdUsers = await UserModel.insertMany(sampleUsers);
      // Send back the created products
      res.send({ createdProducts, createdUsers });
    } catch (error) {
      res.status(500).send({ message: "Failed to seed data", error });
    }
  })
);

export default seedRouter;
