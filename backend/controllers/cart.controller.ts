import type { Request, Response, NextFunction } from "express";
import asyncHander from "express-async-handler";
import prisma from "../lib/prisma.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../generated/prisma/client.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface AuthPayload extends JwtPayload {
  userId: string;
}

interface CartPayload extends JwtPayload {
  cartId: string;
}

export const addToCart = asyncHander(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity, color } = req.body;

    if (!quantity) {
      throw new Error("The quantity is required!");
    }

    if (isNaN(quantity)) {
      throw new Error("The quantity must be a number");
    }

    if (!Number(Number(quantity).toFixed(0)) === quantity) {
      throw new Error("The quantity must be an integer");
    }

    if (!productId) {
      throw new Error("The product id is required");
    }

    if (!color?.trim()) {
      throw new Error("The color is required");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }
    

    const { token } = req.cookies;
    let user;
    if (token) {
      const { userId } = jwt.verify(
        token,
        String(process.env.JWT_SECRET_KEY),
      ) as AuthPayload;
      user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    }

    if (user) {
      let cartId;
      if (user.cartId) {
        cartId = user.cartId;
      } else {
        const cart = await prisma.cart.create({
          data: {},
        });

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            cartId: cart.id,
          },
        });
        cartId = cart.id;
      }

      const data: any = {
        cartId,
        productId,
        quantity: Number(Number(quantity).toFixed(0)),
        color: color.trim(),
      };

      const existingCartItem = await prisma.cartItems.findUnique({
        where: {
          cartId_productId_color: {
            cartId,
            productId,
            color: color.trim(),
          },
        },
      });

      if (existingCartItem) {
        throw new Error("Cart Item already existing");
      }

      const cartItem = await prisma.cartItems.create({
        data,
        include: {
          product: {
            include: {
              images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: "Added to Cart",
        cartItem,
      });

      return;
    }

    const { cartToken } = req.cookies;
    let cartId;
    if (cartToken) {
      ({ cartId } = jwt.verify(
        cartToken,
        String(process.env.JWT_SECRET_KEY),
      ) as CartPayload);
      if (cartId) {
        const cart = await prisma.cart.findUnique({
          where: {
            id: String(cartId),
          },
        });

        if (!cart) {
          throw new Error("Cart not found");
        }
      }
    } else {
      const cart = await prisma.cart.create({
        data: {},
      });
      cartId = cart.id;
    }

    const cartItem = await prisma.cartItems.create({
      data: {
        cartId,
        productId,
        quantity,
        color,
      },
      select: {
        product: {
          include: {
            images: {
              select: {
                url: true,
              },
            },
          },
        },
        quantity: true,
        color: true
      },
    });

    if (!user) {
      const cartToken = jwt.sign(
        { cartId },
        String(process.env.JWT_SECRET_KEY),
        { expiresIn: "15d" },
      );
      res.cookie("cartToken", cartToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });
    }

    res.status(201).json({
      success: true,
      message: "Added to Cart",
      cartItem,
    });
  },
);

export const updateCart = asyncHander(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    const { productId, quantity, color } = req.body;
    let user;    

    if (isNaN(quantity)) {
      throw new Error("The quantity must be a number");
    }

    if (!Number(Number(quantity).toFixed(0)) === quantity) {
      throw new Error("The quantity must be an integer");
    }

    if (quantity < 0) {
      throw new Error("The quantity must be a positive number");
    }

    if (!productId) {
      throw new Error("The product id is required");
    }

    if (!color?.trim()) {
      throw new Error("The color is required");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (token) {
      const { userId } = jwt.verify(
        token,
        String(process.env.JWT_SECRET_KEY),
      ) as AuthPayload;
      user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    }

    let cartId;

    if (user) {
      if (!user.cartId) {
        throw new Error("Add a product to your cart before updating");
      }
      cartId = user.cartId;
    } else {
      const { cartToken } = req.cookies;
      if (!cartToken) {
        throw new Error("Cart token is missing");
      }
      ({ cartId } = jwt.verify(
        cartToken,
        String(process.env.JWT_SECRET_KEY),
      ) as CartPayload);

      const cart = await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
      });

      if (!cart) {
        throw new Error("Cart not found");
      }
    }

    let cartItem;

    cartItem = await prisma.cartItems.findUnique({
      where: {
        cartId_productId_color: {
          cartId,
          productId,
          color: color.trim(),
        },
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found, add the product to the cart");
    }

    if (quantity !== 0) {
      cartItem = await prisma.cartItems.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity,
        },
      });
    } else {
      await prisma.cartItems.delete({
        where: {
          id: cartItem.id,
        },
      });
    }

    const response: { success: boolean; message: string; cartItem?: {} } = {
      success: true,
      message: "Cart Updated",
    };

    if (quantity !== 0) {
      response.cartItem = cartItem;
    }

    res.status(200).json({
      ...response,
    });
  },
);
