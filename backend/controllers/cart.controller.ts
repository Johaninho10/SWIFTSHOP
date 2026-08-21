import type { Request, Response, NextFunction } from "express";
import asyncHander from "express-async-handler";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

export const addToCart = asyncHander(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;

    if (!quantity) {
      throw new Error("The quantity is required!");
    }

    if (isNaN(quantity)) {
      throw new Error("The quantity must be a number");
    }

    if (!Number(Number(quantity).toFixed(0)) === quantity) {
      throw new Error("The quantity must be an integer");
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
      const { userId } = jwt.verify(token, String(process.env.JWT_SECRET_KEY));
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
          data: {
            userId: user.id,
          },
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
      const cartItem = await prisma.cartItems.create({
        data: {
          cartId,
          productId,
          quantity: Number(Number(quantity).toFixed(0)),
        },
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
      ({ cartId } = jwt.verify(cartToken, String(process.env.JWT_SECRET_KEY)));
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
    const { productId, quantity } = req.body;
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

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (token) {
      const { userId } = jwt.verify(token, String(process.env.JWT_SECRET_KEY));
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
      ({ cartId } = jwt.verify(cartToken, String(process.env.JWT_SECRET_KEY)));

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

    if (quantity !== 0) {
      cartItem = await prisma.cartItems.update({
        where: {
          cartId_productId: {
            cartId,
            productId,
          },
        },
        data: {
          quantity,
        },
      });
    } else {
      await prisma.cartItems.delete({
        where: {
          cartId_productId: {
            cartId,
            productId,
          },
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
