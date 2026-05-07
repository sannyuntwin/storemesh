import { Request, Response } from "express";
import multer from "multer";
import { sendSuccess } from "../utils/apiResponse";
import { AppError, BadRequestError } from "../utils/errors";
import { v2 as cloudinary } from "cloudinary";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
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

const resolveCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError("Cloudinary is not configured on the server", 500);
  }

  return { cloudName, apiKey, apiSecret };
};

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const config = resolveCloudinaryConfig();
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true
  });

  return new Promise<{
    secure_url: string;
    public_id: string;
    bytes: number;
    width?: number;
    height?: number;
    format?: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "storemesh/products",
        resource_type: "image",
        overwrite: false
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(new AppError("Failed to upload image to Cloudinary", 500, error));
          return;
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          format: result.format
        });
      }
    );

    stream.end(file.buffer);
  });
};

export const handleUploadProductImage = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("image file is required");
  }

  const uploaded = await uploadToCloudinary(req.file);

  return sendSuccess(
    res,
    {
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      format: uploaded.format,
      width: uploaded.width,
      height: uploaded.height,
      mimeType: req.file.mimetype,
      size: uploaded.bytes
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
