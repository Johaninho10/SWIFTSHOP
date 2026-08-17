import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler"
import prisma from "../lib/prisma";

// Get User informations

export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req
    res.status(200).json({
        success: true,
        user
    })
})

export const getWishList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req

    let wishList = await prisma.wish.findMany({
        where: {
            userId: user.id
        },
        include: {
            product: {
                include: {
                    images: {
                        select: {
                            url: true
                        }
                    }
                }
            }
        }
    })

    res.status(200).json({
        success: true,
        products: wishList.map(wish => wish.product)
    })


})
