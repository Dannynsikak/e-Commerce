import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { ProductModel } from "../models/ProductModel";

const productRouter = Router();

// GET all products
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const products = await ProductModel.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  })
);

// /api/slug/tshirt  by id
productRouter.get(
  "/slug/:slug",
  expressAsyncHandler(async (req, res) => {
    try {
      const product = await ProductModel.findOne({ slug: req.params.slug });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Product not found" });
    }
  })
);

export default productRouter;
