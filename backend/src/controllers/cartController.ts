import { Request, Response } from "express";
import { getCartPreview } from "../services/cartService";
import { sendSuccess } from "../utils/apiResponse";

export const handleGetCart = async (_req: Request, res: Response) => {
  const cart = await getCartPreview();
  return sendSuccess(res, cart);
};
