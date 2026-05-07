import { Router } from "express";
import { handleGetCart } from "../controllers/cartController";
import { asyncHandler } from "../middleware/asyncHandler";

const cartRoutes = Router();

cartRoutes.get("/", asyncHandler(handleGetCart));

export default cartRoutes;
