import { Router } from "express";
import { validateProduct, validateProductResult } from "../middleware/productValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getProducts, createProduct } from "../db/products.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.json(products);
});

//TODO: Add more routes as needed

//TODO GET /products/:slug

router.post("/", authMiddleware, validateProduct, validateProductResult, async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json(product);
});

//TODO PUT /products/:slug

//TODO DELETE /products/:slug
export default router;