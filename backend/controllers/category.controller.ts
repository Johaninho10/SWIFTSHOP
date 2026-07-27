import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "../lib/cloudinary";
import prisma from "../lib/prisma";
import redis from "../lib/redis";

// Get all Categories

export const getCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true,
      },
    });

    res.status(200).json({
      success: true,
      categories,
    });
  },
);

// Get a specific category

export const getCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: String(id),
      },
      include: {
        subCategories: true,
      },
    });

    if (!category) {
      throw new Error("Category not found!");
    }

    res.status(200).json({
      success: true,
      category,
    });
  },
);

// Get Popular Categories

export const getPopularCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = String(await redis.get("popular-categories"));

    res.status(200).json({
      success: true,
      categories: JSON.parse(categories),
    });
  },
);

// Create a category

export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const { name }: { name: string } = req.body;

    if (!name?.trim()) {
      throw new Error("The name of the category is required!");
    }

    if (!file) {
      throw new Error("You must provide at least one image!");
    }

    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: "categories",
    });

    await prisma.category.create({
      data: {
        name,
        image: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully!",
    });
  },
);

// Update a category

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const body: { name?: string; isPopular?: string } = req.body;

    const category = await prisma.category.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!category) {
      throw new Error("Category not found!");
    }

    const file = req.file;
    const data: { name?: string; image?: string; isPopular?: boolean } = {};

    if (body.name?.trim()) {
      data.name = body.name.trim();
    }

    if (body.isPopular) {
      data.isPopular = body.isPopular === "true";
    }

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "image",
        folder: "categories",
      });
      data.image = result.secure_url;
    }

    await prisma.category.update({
      where: {
        id: category.id,
      },
      data,
    });

    if (category.isPopular || data.isPopular !== undefined) {
      const popularCategories = await prisma.category.findMany({
        where: {
          isPopular: true,
        },
      });

      await redis.set("popular-categories", JSON.stringify(popularCategories));
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully!",
    });
  },
);

// Toggle the popularity of a category

export const togglePopularity = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        isPopular: !category.isPopular,
      },
    });

    const popularCategories = await prisma.category.findMany({
      where: {
        isPopular: true,
      },
    });

    await redis.set("popular-categories", JSON.stringify(popularCategories));

    res.status(200).json({
      success: true,
      message: "Popularity toggled",
    });
  },
);

// Delete a category

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!category) {
      throw new Error("Category not found!");
    }

    await prisma.category.delete({
      where: {
        id: category.id,
      },
    });

    if (category.isPopular) {
      const popularCategories = await prisma.category.findMany({
        where: {
          isPopular: true,
        },
      });

      await redis.set("popular-categories", JSON.stringify(popularCategories));
    }

    res.status(200).json({
      success: true,
      message: "Category deletd successfully!",
    });
  },
);
