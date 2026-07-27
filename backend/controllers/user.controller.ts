import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler"

// Get User informations

export const getUser = asyncHandler(async (req:Request, res: Response, next: NextFunction) => {
    const {user} = req
    res.status(200).json({
        success: true,
        user
    })
})