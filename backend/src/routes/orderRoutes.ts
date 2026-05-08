import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  handleCreateOrder,
  handleCreateShippingLabel,
  handleGetOrders,
  handleGetOrderById,
  handlePrintShippingLabel
} from "../controllers/orderController";

const orderRoutes = Router();

orderRoutes.get("/", asyncHandler(handleGetOrders));
orderRoutes.post("/", asyncHandler(handleCreateOrder));
orderRoutes.get("/:id", asyncHandler(handleGetOrderById));
orderRoutes.post("/:id/shipping-label", asyncHandler(handleCreateShippingLabel));
orderRoutes.get("/:id/shipping-label/print", asyncHandler(handlePrintShippingLabel));

export default orderRoutes;
