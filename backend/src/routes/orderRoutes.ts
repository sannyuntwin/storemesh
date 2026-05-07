import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { handleCreateOrder, handleCreateShippingLabel, handleGetOrderById } from "../controllers/orderController";

const orderRoutes = Router();

orderRoutes.post("/", asyncHandler(handleCreateOrder));
orderRoutes.get("/:id", asyncHandler(handleGetOrderById));
orderRoutes.post("/:id/shipping-label", asyncHandler(handleCreateShippingLabel));

export default orderRoutes;
