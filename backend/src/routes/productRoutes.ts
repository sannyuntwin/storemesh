import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  handleAddStock,
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProductById,
  handleGetProducts,
  handleUpdateInventory,
  handleUpdateProduct
} from "../controllers/productController";

const productRoutes = Router();

productRoutes.get("/", asyncHandler(handleGetProducts));
productRoutes.get("/:id", asyncHandler(handleGetProductById));
productRoutes.post("/", asyncHandler(handleCreateProduct));
productRoutes.put("/:id", asyncHandler(handleUpdateProduct));
productRoutes.delete("/:id", asyncHandler(handleDeleteProduct));

// Seller inventory utilities
productRoutes.post("/:id/stock", asyncHandler(handleAddStock));
productRoutes.patch("/:id/inventory", asyncHandler(handleUpdateInventory));

export default productRoutes;
