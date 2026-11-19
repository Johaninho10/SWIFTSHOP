import { Router } from "express";
import { addToCart, updateCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add-to-cart", addToCart);
cartRouter.patch("/update-cart", updateCart);

export default cartRouter;
