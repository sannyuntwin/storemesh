import { Router } from "express";
import {
  handleUploadError,
  handleUploadProductImage,
  uploadProductImageMiddleware
} from "../controllers/uploadController";

const uploadRoutes = Router();

uploadRoutes.post("/product-image", (req, res, next) => {
  uploadProductImageMiddleware(req, res, (error) => {
    try {
      if (error) {
        handleUploadError(error);
      }
      handleUploadProductImage(req, res);
    } catch (caught) {
      next(caught);
    }
  });
});

export default uploadRoutes;
