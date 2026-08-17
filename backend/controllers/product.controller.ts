import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler"
import cloudinary from "../lib/cloudinary";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken"

type Inputs = {
    title?: string,
    price: number,
    brand?: string,
    description?: string
    colors: string,
    categoriesIDs: string,
    subCategoriesIDs: string
}

export const getNewArrivals = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc"
        },
        take: 10,
        include: {
            images: {
                select: {
                    url: true
                }
            }
        }
    })

    const { token } = req.cookies

    let user
    let wishedProductsIDs: string[] = []

    if (token) {
        const { userId } = jwt.verify(token, String(process.env.JWT_SECRET_KEY))
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        const wishes = await prisma.wish.findMany()
        wishedProductsIDs = wishes.map(wish => wish.productId)
    }

    products = products.map(product => {
        if(wishedProductsIDs.includes(product.id)){
            product.saved = true
        }else{
            product.saved = false
        }
        return product
    })

    res.status(200).json({
        success: true,
        products
    })
})

export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const product = await prisma.product.findUnique({
        where: {
            id: String(id)
        },
        include: {
            images: {
                select: {
                    url: true
                }
            }
        }
    })

    if (!product) {
        throw new Error("Product not found")
    }

    res.status(200).json({
        success: true,
        product
    })
})


export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files

    const { title, price, brand, description, colors, categoriesIDs, subCategoriesIDs }: Inputs = req.body



    if (files?.length === 0) {
        throw new Error("You must upload at least one image of the product")
    }

    if (!title?.trim()) {
        throw new Error("You must enter the title of the product")
    }

    if (!brand?.trim()) {
        throw new Error("You must enter the brand of the product")
    }

    if (!description?.trim()) {
        throw new Error("You must enter the description of the product")
    }

    if (isNaN(price)) {
        throw new Error("The price must be a number")
    }

    if (!Array.isArray(JSON.parse(colors))) {
        throw new Error("Incorrect colors format")
    }

    if (!Array.isArray(JSON.parse(categoriesIDs))) {
        throw new Error("The categories must come in an array")
    }

    if (JSON.parse(categoriesIDs).length === 0) {
        throw new Error("The product must belong to at least one category")
    }

    if (!Array.isArray(JSON.parse(subCategoriesIDs))) {
        throw new Error("The sub categories must come in an array")
    }

    const results = await Promise.all(files?.map((file) => cloudinary.uploader.upload(file.path, { resource_type: "image", folder: "products" })))

    const images: string[] = results.map(result => result.secure_url)

    const product = await prisma.product.create({
        data: {
            title: title.trim(),
            price: Number(price),
            brand: brand.trim(),
            description: description.trim(),
            colors: JSON.parse(colors),
            categoriesIDs: JSON.parse(categoriesIDs),
            subCategoriesIDs: JSON.parse(subCategoriesIDs)
        }
    })



    images.forEach(async image => {
        await prisma.image.create({
            data: {
                url: image,
                productId: product.id
            }
        })
    })

    res.status(201).json({
        success: true,
        message: "Product created successfully"
    })
})

export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files
    const { id } = req.params
    const { title, price, brand, description, colors, categoriesIDs, subCategoriesIDs }: Inputs = req.body

    if (!title?.trim()) {
        throw new Error("You must enter the title of the product")
    }

    if (!brand?.trim()) {
        throw new Error("You must enter the brand of the product")
    }

    if (!description?.trim()) {
        throw new Error("You must enter the description of the product")
    }

    if (isNaN(price)) {
        throw new Error("The price must be a number")
    }

    if (!Array.isArray(JSON.parse(colors))) {
        throw new Error("Incorrect colors format")
    }

    if (!Array.isArray(JSON.parse(categoriesIDs))) {
        throw new Error("The categories must come in an array")
    }

    if (JSON.parse(categoriesIDs).length === 0) {
        throw new Error("The product must belong to at least one category")
    }

    if (!Array.isArray(JSON.parse(subCategoriesIDs))) {
        throw new Error("The sub categories must come in an array")
    }

    let images: string[]

    if (files?.length !== 0) {
        const results = await Promise.all(files?.map((file) => cloudinary.uploader.upload(file.path, { resource_type: "image", folder: "products" })))

        images = results.map(result => result.secure_url)

        images.forEach(async image => {
            await prisma.image.create({
                data: {
                    url: image,
                    productId: String(id)
                }
            })
        })
    }

    const product = await prisma.product.update({
        where: {
            id: String(id)
        },

        data: {
            title: title.trim(),
            price: Number(price),
            brand: brand.trim(),
            description: description.trim(),
            colors: JSON.parse(colors),
            categoriesIDs: JSON.parse(categoriesIDs),
            subCategoriesIDs: JSON.parse(subCategoriesIDs)
        }
    })

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    })
})

export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params


    await prisma.product.delete({
        where: {
            id: String(id)
        }
    })

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

export const deleteImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const image = await prisma.image.findUnique({
        where: {
            id: String(id)
        }
    })

    if (!image) {
        throw new Error("Image not found")
    }

    const images = await prisma.image.findMany({
        where: {
            productId: image.productId
        }
    })

    if (images.length === 1) {
        throw new Error("The product must have at least one image")
    }

    await prisma.image.delete({
        where: {
            id: String(id)
        }
    })

    res.status(200).json({
        success: true,
        message: "Image deleted successfully!"
    })
})

export const toggleWish = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.body
    const { user } = req

    if (!productId) {
        throw new Error("You must provide the id of the product")
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })

    if (!product) {
        throw new Error("Product not found")
    }

    const wish = await prisma.wish.findUnique({
        where: {
            userId_productId: {
                userId: user.id,
                productId
            }
        }
    })

    if (wish) {
        await prisma.wish.delete({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        })

        return
    }

    await prisma.wish.create({
        data: {
            userId: user.id,
            productId
        }
    })

    res.status(201).json({
        success: true,
        message: "Product added to wishlist"
    })

})