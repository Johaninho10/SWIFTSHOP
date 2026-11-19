import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import asyncHandler from "express-async-handler";
import { User } from "../generated/prisma/client.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const getReview = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400);
      throw new Error("The id of the review is required");
    }

    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      res.status(400);
      throw new Error("Review not found");
    }

    res.status(200).json({
      success: true,
      review,
    });
  },
);

export const getReviews = asyncHandler(
  async (
    req: Request<{ productId: string }, unknown, unknown, { page: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const { productId } = req.params;
    const { page = "1" } = req.query;

    if (!productId) {
      throw new Error("The product id is required");
    }

    if (isNaN(Number(page))) {
      throw new Error("The page must be a number");
    }

    if (!Number.isInteger(Number(page))) {
      throw new Error("The page must be an integer");
    }

    if (Number(page) <= 0) {
      throw new Error("The page must be a positive number");
    }

    const take = 5;

    const total = await prisma.review.count({
      where: {
        productId: String(productId),
      },
    });

    const totalPages = Math.ceil(total / take);

    const reviews = await prisma.review.findMany({
      where: {
        productId: String(productId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
      take,
      skip: (Number(page) - 1) * take,
    });

    res.status(200).json({
      success: true,
      reviews,
      total,
      page: JSON.parse(page),
      totalPages,
    });
  },
);

export const createReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      productId,
      rate,
      text,
    }: { productId: string; rate: number; text: string } = req.body;

    const { user } = req;

    if (!user) {
      throw new Error();
    }

    if (!productId.trim()) throw new Error("The product's id is required");

    if (!text.trim()) {
      throw new Error("The text of the review is required");
    }

    if (isNaN(rate)) {
      throw new Error("The rate must be a number");
    }

    if (rate <= 0 || rate > 5) {
      throw new Error(
        "The rate must be greater than 0 and less than or equal to 5",
      );
    }

    const review = await prisma.review.create({
      data: {
        productId: productId.trim(),
        userId: String(user.id),
        rate: Number(rate),
        text: text.trim(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  },
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { rate, text }: { productId: string; rate: number; text: string } =
      req.body;

    const { user } = req;

    if (!user) {
      throw new Error();
    }

    if (!text.trim()) {
      throw new Error("The text of the review is required");
    }

    if (isNaN(rate)) {
      throw new Error("The rate must be a number");
    }

    if (rate <= 0 || rate > 5) {
      throw new Error(
        "The rate must be greater than 0 and less than or equal to 5",
      );
    }

    const review = await prisma.review.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId !== user.id) {
      throw new Error("You are not allowed to update this review");
    }

    const newReview = await prisma.review.update({
      where: {
        id: String(id),
      },
      data: {
        text: text.trim(),
        rate: Number(rate),
      },
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: newReview,
    });
  },
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { user } = req;

    if (!user) {
      throw new Error();
    }

    const review = await prisma.review.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId !== user.id) {
      throw new Error("You are not allowed to delete this review");
    }

    await prisma.review.delete({
      where: {
        id: String(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  },
);
