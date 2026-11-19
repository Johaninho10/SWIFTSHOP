import { Router } from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
} from "../controllers/subcategory.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const subCategoryRouter = Router();

// Endpoints

subCategoryRouter.get("/:id", getSubCategories);
subCategoryRouter.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  createSubCategory,
);
subCategoryRouter.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateSubCategory,
);
subCategoryRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteSubCategory,
);

export default subCategoryRouter;
