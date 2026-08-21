import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { getCart, getUser, getWishList } from "../controllers/user.controller";

const userRouter = Router();

// Endpoints
userRouter.get("/wishlist", authMiddleware, getWishList);
userRouter.get("/cart", getCart);
userRouter.get("/", authMiddleware, getUser);

export default userRouter;
