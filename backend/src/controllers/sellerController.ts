import { Request, Response } from "express";
import { getSellerStats } from "../services/sellerService";
import { sendSuccess } from "../utils/apiResponse";

export const handleGetSellerStats = async (_req: Request, res: Response) => {
  const stats = await getSellerStats();
  return sendSuccess(res, stats);
};
