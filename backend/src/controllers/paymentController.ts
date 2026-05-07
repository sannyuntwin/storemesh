import { Request, Response } from "express";
import { createPayment } from "../services/paymentService";
import { sendSuccess } from "../utils/apiResponse";
import { validateCreatePayment } from "../utils/validators";

export const handleCreatePayment = async (req: Request, res: Response) => {
  const payload = validateCreatePayment(req.body);
  const payment = await createPayment(payload);
  return sendSuccess(res, payment, 201);
};
