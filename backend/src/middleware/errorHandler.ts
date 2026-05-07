import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): Response => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        details: err.details
      }
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal server error"
    }
  });
};
