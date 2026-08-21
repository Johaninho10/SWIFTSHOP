import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

type User = {
  firstname: string;
  lastname: string;
  email: string;
};

// Get User informations

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user }: { user: User } = req;
    const result = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };
    res.status(200).json({
      success: true,
      user: result,
    });
  },
);

export const getWishList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    let wishList = await prisma.wish.findMany({
      where: {
        userId: user.id,
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

    res.status(200).json({
      success: true,
      products: wishList.map((wish) => wish.product),
    });
  },
);

export const getCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    let cartId;

    if (token) {
      const { userId } = jwt.verify(token, String(process.env.JWT_SECRET_KEY));
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user?.cartId) {
        throw new Error("No cart id");
      }
      cartId = user.cartId;
    } else {
      const { cartToken } = req.cookies;
      if (!cartToken) {
        throw new Error("Cart token missing");
      }
      ({ cartId } = jwt.verify(cartToken, String(process.env.JWT_SECRET_KEY)));
    }

    const cart = (
      await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
        select: {
          cartItems: {
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
          },
        },
      })
    )?.cartItems;

    if (!cart) {
      throw new Error("Cart not found");
    }

    res.status(200).json({
      success: true,
      cart,
    });
  },
);
