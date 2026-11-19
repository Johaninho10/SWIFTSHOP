import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/review.controller.js";

const reviewRouter = Router();

reviewRouter.get("/product/:productId", getReviews);
reviewRouter.get("/:id", getReview);
reviewRouter.post("/create", authMiddleware, createReview);
reviewRouter.patch("/:id", authMiddleware, updateReview);
reviewRouter.delete("/:id", authMiddleware, deleteReview);

export default reviewRouter;
