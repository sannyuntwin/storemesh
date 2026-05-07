import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { handleGoogleAuth, handleGoogleRegister } from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/google", asyncHandler(handleGoogleAuth));
authRoutes.post("/google/register", asyncHandler(handleGoogleRegister));

export default authRoutes;
