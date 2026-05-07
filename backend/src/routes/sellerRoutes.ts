import { Router } from "express";
import { handleGetSellerStats } from "../controllers/sellerController";
import { asyncHandler } from "../middleware/asyncHandler";

const sellerRoutes = Router();

sellerRoutes.get("/stats", asyncHandler(handleGetSellerStats));

export default sellerRoutes;
