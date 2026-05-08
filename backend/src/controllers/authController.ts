import { Request, Response } from "express";
import { loginWithGoogleMock, registerGoogleBuyer, registerSellerAccount } from "../services/authService";
import { sendSuccess } from "../utils/apiResponse";
import { validateGoogleAuth, validateGoogleRegister, validateSellerRegister } from "../utils/validators";

export const handleGoogleAuth = async (req: Request, res: Response) => {
  const payload = validateGoogleAuth(req.body);
  const user = await loginWithGoogleMock(payload);

  return sendSuccess(
    res,
    {
      message: "Google OAuth-ready mock flow completed",
      user
    },
    200
  );
};

export const handleGoogleRegister = async (req: Request, res: Response) => {
  const payload = validateGoogleRegister(req.body);
  const user = await registerGoogleBuyer(payload);

  return sendSuccess(
    res,
    {
      message: "Google-authenticated buyer registration synced",
      user,
      profileCompleted: Boolean(user.address)
    },
    200
  );
};

export const handleSellerRegister = async (req: Request, res: Response) => {
  const payload = validateSellerRegister(req.body);
  const user = await registerSellerAccount(payload);

  return sendSuccess(
    res,
    {
      message: "Seller account synced",
      user
    },
    200
  );
};
