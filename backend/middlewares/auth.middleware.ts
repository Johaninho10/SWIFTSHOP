import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma.js";

interface AuthPayload extends JwtPayload {
  userId: string;
}

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    res.setHeader("Cache-Control", "private, no-store");

    if (!token) {
      throw new Error("No token provided!");
    }

    const { userId } = jwt.verify(
      token,
      String(process.env.JWT_SECRET_KEY),
    ) as AuthPayload;

    if (!userId) {
      throw new Error("Invalid token");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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
