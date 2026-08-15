import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin.middleware";
import {
  createImage,
  deleteImage,
  getImages,
} from "../controllers/banner.controller";
import upload from "../lib/multer";

const bannerRouter = Router();

// Endpoints
bannerRouter.post(
  "/add-image",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createImage,
);
bannerRouter.get("/", getImages);
bannerRouter.delete("/:id", authMiddleware, adminMiddleware, deleteImage);

export default bannerRouter;
