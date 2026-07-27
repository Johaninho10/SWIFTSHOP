import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import upload from "../lib/multer";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getPopularCategories,
  togglePopularity,
  updateCategory,
} from "../controllers/category.controller";

const categoryRouter = Router();

// Endpoints
categoryRouter.get("/", getCategories);

categoryRouter.get("/popular", getPopularCategories);

categoryRouter.get("/:id", getCategory);

categoryRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createCategory,
);

categoryRouter.patch(
  "/toggle-popularity/:id",
  authMiddleware,
  adminMiddleware,
  togglePopularity,
);

categoryRouter.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateCategory,
);

categoryRouter.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default categoryRouter;
