import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import { User } from "../generated/prisma/client.js";




declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

interface AuthPayload extends JwtPayload {
  userId: string
}

interface CartPayload extends JwtPayload {
  cartId: string;
}


// Get User informations

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if(!user){
      throw new Error()
    }
    const result = {
      id: user.id,
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

    if(!user){
      throw new Error()
    }

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

    const productsIDs = wishList.map((wish) => wish.productId);

    const reviewsGroup = await prisma.review.groupBy({
      by: "productId",
      where: {
        productId: {
          in: productsIDs,
        },
      },
      _avg: {
        rate: true,
      },
      _count: {
        id: true,
      },
    });

    const products: any = wishList
      .map((wish) => wish.product)
      .map((product : any) => {
        const reviewGroup = reviewsGroup.find(
          (item) => item.productId === product.id,
        );

        product.rate = reviewGroup?._avg.rate || 0;
        product.reviews = reviewGroup?._count.id || 0;

        return product;
      });

    res.status(200).json({
      success: true,
      products,
    });
  },
);

export const getCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    let cartId;

    if (token) {
      const { userId } = jwt.verify(token, String(process.env.JWT_SECRET_KEY)) as AuthPayload;
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
      ({ cartId } = jwt.verify(cartToken, String(process.env.JWT_SECRET_KEY)) as CartPayload);
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
              color: true
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
