import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import upload from "../lib/multer.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getPopularCategories,
  togglePopularity,
  updateCategory,
} from "../controllers/category.controller.js";

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
