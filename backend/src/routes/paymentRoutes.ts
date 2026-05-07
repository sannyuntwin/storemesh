import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { handleCreatePayment } from "../controllers/paymentController";

const paymentRoutes = Router();

paymentRoutes.post("/", asyncHandler(handleCreatePayment));

export default paymentRoutes;
