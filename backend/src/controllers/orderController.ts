import { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse";
import { parseIdParam, validateCreateOrder, validateCreateShippingLabel } from "../utils/validators";
import { createOrder, createShippingLabelForOrder, getOrderById } from "../services/orderService";

export const handleCreateOrder = async (req: Request, res: Response) => {
  const payload = validateCreateOrder(req.body);
  const order = await createOrder(payload);
  return sendSuccess(res, order, 201);
};

export const handleGetOrderById = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id, "order id");
  const order = await getOrderById(id);
  return sendSuccess(res, order);
};

export const handleCreateShippingLabel = async (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id, "order id");
  const payload = validateCreateShippingLabel(req.body);
  const shippingLabel = await createShippingLabelForOrder(id, payload);
  return sendSuccess(res, shippingLabel, 201);
};
