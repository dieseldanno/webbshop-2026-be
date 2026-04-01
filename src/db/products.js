import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export async function getProducts() {
  return await Product.find();
}

export async function createProduct(productData) {
    try {
        const product = new Product(productData);
        await product.save();
        return product;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

//TODO: Add more functions as needed