import { Router } from "express";
import {
  handleUploadError,
  handleUploadProductImage,
  uploadProductImageMiddleware
} from "../controllers/uploadController";

const uploadRoutes = Router();

uploadRoutes.post("/product-image", uploadProductImageMiddleware, (req, res, next) => {
  try {
    handleUploadProductImage(req, res).catch(next);
  } catch (error) {
    next(error);
  }
});

export default uploadRoutes;
