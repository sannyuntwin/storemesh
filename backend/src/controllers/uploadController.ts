import fs from "node:fs";
import path from "node:path";
import { Request, Response } from "express";
import multer from "multer";
import { sendSuccess } from "../utils/apiResponse";
import { BadRequestError } from "../utils/errors";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 60);
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${Date.now()}-${safeName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new BadRequestError("Only JPG, PNG, and WEBP images are allowed"));
      return;
    }
    cb(null, true);
  }
});

export const uploadProductImageMiddleware = upload.single("image");

export const handleUploadProductImage = (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("image file is required");
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`;
  return sendSuccess(
    res,
    {
      imageUrl,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size
    },
    201
  );
};

export const handleUploadError = (error: unknown) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      throw new BadRequestError("Image must be 5MB or smaller");
    }
    throw new BadRequestError(error.message);
  }

  throw error;
};
