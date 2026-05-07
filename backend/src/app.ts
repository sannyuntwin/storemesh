import cors from "cors";
import express from "express";
import path from "node:path";
import apiRoutes from "./routes";
import { CORS_ORIGIN } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

const allowedOrigins = CORS_ORIGIN
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Storemesh backend is running"
    }
  });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
