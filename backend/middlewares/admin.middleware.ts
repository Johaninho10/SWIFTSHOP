import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";

const adminMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    if (user.role !== "ADMIN") {
      throw new Error("Not authorized");
    }
    next();
  },
);

export default adminMiddleware;
