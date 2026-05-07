import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import {
  validateAddStock,
  validateCreateProduct,
  validateUpdateInventory,
  validateUpdateProduct,
  parseIdParam
} from "../utils/validators";
import {
  addStock,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateInventory,
  updateProduct
} from "../services/productService";

export const handleGetProducts = async (_req: Request, res: Response) => {
  const products = await getProducts();
  return sendSuccess(res, products);
};

export const handleGetProductById = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id, "product id");
  const product = await getProductById(id);
  return sendSuccess(res, product);
};

export const handleCreateProduct = async (req: Request, res: Response) => {
  const payload = validateCreateProduct(req.body);
  const product = await createProduct(payload);
  return sendSuccess(res, product, 201);
};

export const handleUpdateProduct = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id, "product id");
  const payload = validateUpdateProduct(req.body);
  const product = await updateProduct(id, payload);
  return sendSuccess(res, product);
};

export const handleDeleteProduct = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id, "product id");
  await deleteProduct(id);
  return sendSuccess(res, { message: "Product deleted successfully" });
};

export const handleAddStock = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id, "product id");
  const payload = validateAddStock(req.body);
  const product = await addStock(id, payload.quantityAdded);
  return sendSuccess(res, product);
};

export const handleUpdateInventory = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id, "product id");
  const payload = validateUpdateInventory(req.body);
  const product = await updateInventory(id, payload.quantity);
  return sendSuccess(res, product);
};
