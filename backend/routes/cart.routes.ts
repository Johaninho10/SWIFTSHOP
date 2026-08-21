import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { addToCart, updateCart } from "../controllers/cart.controller";

const cartRouter = Router();

cartRouter.post("/add-to-cart", addToCart);
cartRouter.patch("/update-cart", updateCart);

export default cartRouter;
