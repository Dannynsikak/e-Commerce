import { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";

const allProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

const allProductsController = {
  allProducts,
};
export default allProductsController;
