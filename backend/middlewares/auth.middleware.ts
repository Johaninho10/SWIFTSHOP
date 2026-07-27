import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("No token provided!");
    }

    const { userId } = jwt.verify(token, String(process.env.JWT_SECRET_KEY));

    if (!userId) {
      throw new Error("Invalid token");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  },
);

export default authMiddleware;
