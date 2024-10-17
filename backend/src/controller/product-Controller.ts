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

// Controller to add a new product
const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
      rating,
      numReviews,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !slug ||
      !image ||
      !brand ||
      !category ||
      !description ||
      price === undefined ||
      countInStock === undefined ||
      rating === undefined ||
      numReviews === undefined
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if the slug is unique
    const existingProduct = await ProductModel.findOne({ slug });
    if (existingProduct) {
      res
        .status(400)
        .json({ message: "Product with this slug already exists" });
      return;
    }

    // Create a new product instance
    const newProduct = new ProductModel({
      name,
      slug,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
      rating,
      numReviews,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Respond with the created product
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

const allProductsController = {
  allProducts,
  addProduct,
};
export default allProductsController;
