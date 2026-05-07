import cartRoutes from "./cartRoutes";
import authRoutes from "./authRoutes";
import { Router } from "express";
import orderRoutes from "./orderRoutes";
import paymentRoutes from "./paymentRoutes";
import productRoutes from "./productRoutes";
import sellerRoutes from "./sellerRoutes";
import uploadRoutes from "./uploadRoutes";

const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok"
    }
  });
});

apiRoutes.use("/products", productRoutes);
apiRoutes.use("/orders", orderRoutes);
apiRoutes.use("/payments", paymentRoutes);
apiRoutes.use("/cart", cartRoutes);
apiRoutes.use("/seller", sellerRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/uploads", uploadRoutes);

export default apiRoutes;
