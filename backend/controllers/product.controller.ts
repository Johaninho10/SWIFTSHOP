import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "../lib/cloudinary";
import prisma from "../lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Image, Product, User } from "../generated/prisma/client";

type Inputs = {
  title?: string;
  price: number;
  brand?: string;
  description?: string;
  colors: string;
  categoriesIDs: string;
  subCategoriesIDs: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface AuthPayload extends JwtPayload {
  userId: string;
}

interface CartPayload extends JwtPayload {
  cartId: string;
}

export const getNewArrivals = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let products: any = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    const productsIDs = products.map((product: any) => product.id);

    const reviewsGroupBy = await prisma.review.groupBy({
      by: "productId",
      _avg: {
        rate: true,
      },
      _count: {
        id: true,
      },
      where: {
        productId: {
          in: productsIDs,
        },
      },
    });

    const { token } = req.cookies;

    let wishedProductsIDs: string[] = [];

    if (token) {
      const { userId } = jwt.verify(
        token,
        String(process.env.JWT_SECRET_KEY),
      ) as AuthPayload;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if(!user){
        throw new Error()
      }
      const wishes = await prisma.wish.findMany();
      wishedProductsIDs = wishes.map((wish) => wish.productId);
    }

    products = products.map((product: any) => {
      if (wishedProductsIDs.includes(product.id)) {
        product.saved = true;
      } else {
        product.saved = false;
      }

      const reviewGroupBy = reviewsGroupBy.find(
        (item) => item.productId === product.id,
      );

      if (reviewGroupBy) {
        product.rate = reviewGroupBy._avg.rate;
        product.reviews = reviewGroupBy._count.id;
      } else {
        product.rate = 0;
        product.reviews = 0;
      }
      return product;
    });

    res.status(200).json({
      success: true,
      products,
    });
  },
);

export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product: any = await prisma.product.findUnique({
      where: {
        id: String(id),
      },
      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    

    const reviews = await prisma.review.count({
      where: {
        productId: product.id,
      },
    });

    product.reviews = reviews || 0;

    const reviewGroupBy = await prisma.review.groupBy({
      by: "productId",
      where: {
        productId: product.id,
      },
      _avg: {
        rate: true,
      },
    });
    

    product.rate = reviewGroupBy[0]?._avg?.rate || 0;

    let saved = false;

    const { token } = req.cookies;

    if (token) {
      const { userId } = jwt.verify(
        token,
        String(process.env.JWT_SECRET_KEY),
      ) as AuthPayload;

      const wish = await prisma.wish.findUnique({
        where: {
          userId_productId: {
            userId,
            productId: String(id),
          },
        },
      });

      if (wish) {
        saved = true;
      }
    }

    product.saved = saved;

    res.status(200).json({
      success: true,
      product,
    });
  },
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const files = req.files;

    const {
      title,
      price,
      brand,
      description,
      colors,
      categoriesIDs,
      subCategoriesIDs,
    }: Inputs = req.body;    

    if (!files || files?.length === 0) {
      throw new Error("You must upload at least one image of the product");
    }

    if (!title?.trim()) {
      throw new Error("You must enter the title of the product");
    }

    if (!brand?.trim()) {
      throw new Error("You must enter the brand of the product");
    }

    if (!description?.trim()) {
      throw new Error("You must enter the description of the product");
    }

    if (isNaN(price)) {
      throw new Error("The price must be a number");
    }

    if (!Array.isArray(JSON.parse(colors))) {
      throw new Error("Incorrect colors format");
    }

    if (!Array.isArray(JSON.parse(categoriesIDs))) {
      throw new Error("The categories must come in an array");
    }

    if (JSON.parse(categoriesIDs).length === 0) {
      throw new Error("The product must belong to at least one category");
    }

    if (!Array.isArray(JSON.parse(subCategoriesIDs))) {
      throw new Error("The sub categories must come in an array");
    }

    const results = await Promise.all(
      files.map((file: any) =>
        cloudinary.uploader.upload(file.path, {
          resource_type: "image",
          folder: "products",
        }),
      ),
    );

    const images: string[] = results.map((result: any) => result.secure_url);

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        price: Number(price),
        brand: brand.trim(),
        description: description.trim(),
        colors: JSON.parse(colors),
        categoriesIDs: JSON.parse(categoriesIDs),
        subCategoriesIDs: JSON.parse(subCategoriesIDs),
      },
    });

    images.forEach(async (image) => {
      await prisma.image.create({
        data: {
          url: image,
          productId: product.id,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  },
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files;
    const { id } = req.params;
    const {
      title,
      price,
      brand,
      description,
      colors,
      categoriesIDs,
      subCategoriesIDs,
    }: Inputs = req.body;

    if (!title?.trim()) {
      throw new Error("You must enter the title of the product");
    }

    if (!brand?.trim()) {
      throw new Error("You must enter the brand of the product");
    }

    if (!description?.trim()) {
      throw new Error("You must enter the description of the product");
    }

    if (isNaN(price)) {
      throw new Error("The price must be a number");
    }

    if (!Array.isArray(JSON.parse(colors))) {
      throw new Error("Incorrect colors format");
    }

    if (!Array.isArray(JSON.parse(categoriesIDs))) {
      throw new Error("The categories must come in an array");
    }

    if (JSON.parse(categoriesIDs).length === 0) {
      throw new Error("The product must belong to at least one category");
    }

    if (!Array.isArray(JSON.parse(subCategoriesIDs))) {
      throw new Error("The sub categories must come in an array");
    }

    let images: string[];

    if (files?.length !== 0) {
      const results = await Promise.all(
        new Array(files).map((file: any) =>
          cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            folder: "products",
          }),
        ),
      );

      images = results.map((result) => result.secure_url);

      images.forEach(async (image) => {
        await prisma.image.create({
          data: {
            url: image,
            productId: String(id),
          },
        });
      });
    }

    const product = await prisma.product.update({
      where: {
        id: String(id),
      },

      data: {
        title: title.trim(),
        price: Number(price),
        brand: brand.trim(),
        description: description.trim(),
        colors: JSON.parse(colors),
        categoriesIDs: JSON.parse(categoriesIDs),
        subCategoriesIDs: JSON.parse(subCategoriesIDs),
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.image.deleteMany({
      where: {
        productId: product?.id,
      },
    });

    await prisma.product.delete({
      where: {
        id: String(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  },
);

export const deleteImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const image = await prisma.image.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!image) {
      throw new Error("Image not found");
    }

    const images = await prisma.image.findMany({
      where: {
        productId: image.productId,
      },
    });

    if (images.length === 1) {
      throw new Error("The product must have at least one image");
    }

    await prisma.image.delete({
      where: {
        id: String(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Image deleted successfully!",
    });
  },
);

export const toggleWish = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.body;
    const { user } = req;

    if (!user) {
      throw new Error("You must be authenticated");
    }

    if (!productId) {
      throw new Error("You must provide the id of the product");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const wish = await prisma.wish.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (wish) {
      await prisma.wish.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
      });

      return;
    }

    await prisma.wish.create({
      data: {
        userId: user.id,
        productId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
    });
  },
);
