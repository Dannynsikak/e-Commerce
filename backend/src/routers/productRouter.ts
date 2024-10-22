import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { ProductModel } from "../models/ProductModel";
import allProductsController from "../controller/product-Controller";

const productRouter = Router();

// GET all products
productRouter.get("/", allProductsController.allProducts);

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

productRouter.post("/addproducts", allProductsController.addProduct);
productRouter.delete("/:id", allProductsController.deleteProduct);
export default productRouter;
