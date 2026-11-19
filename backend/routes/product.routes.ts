import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../lib/multer.js";
import {
  createProduct,
  deleteImage,
  deleteProduct,
  getNewArrivals,
  getProduct,
  getProducts,
  getSimilarProducts,
  toggleWish,
  updateProduct,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get("/similar/:id", getSimilarProducts);
productRouter.get("/new-arrivals", getNewArrivals);
productRouter.get("/:id", getProduct);
productRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.array("image"),
  createProduct,
);
productRouter.post("/toggle-wish", authMiddleware, toggleWish);
productRouter.patch("/:id", authMiddleware, adminMiddleware, updateProduct);
productRouter.delete(
  "/image/:id",
  authMiddleware,
  adminMiddleware,
  deleteImage,
);
productRouter.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
export default productRouter;
