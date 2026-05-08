import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { handleGoogleAuth, handleGoogleRegister, handleSellerRegister } from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/google", asyncHandler(handleGoogleAuth));
authRoutes.post("/google/register", asyncHandler(handleGoogleRegister));
authRoutes.post("/seller/register", asyncHandler(handleSellerRegister));

export default authRoutes;
