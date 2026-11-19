import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import redis from "../lib/redis.js";

// Get Sub Categories of a specific category

export const getSubCategories = asyncHandler(
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
      throw new Error("Category not found");
    }

    res.status(200).json({
      success: true,
      subCategories: category.subCategories,
    });
  },
);

// Create a sub Category

export const createSubCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId, name }: { categoryId: string; name: string } = req.body;

    if (!categoryId) {
      res.status(400);
      throw new Error("The category id is required");
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }
    if (!name?.trim()) {
      throw new Error("The sub category name is required");
    }

    await prisma.subCategory.create({
      data: {
        categoryId,
        name: name.trim(),
      },
    });

    if (category.isPopular) {
      const popularCategories = await prisma.category.findMany({
        where: {
          isPopular: true,
        },
        include: {
          subCategories: true
        }
      });

      await redis.set("popular-categories", JSON.stringify(popularCategories));
    }

    res.status(201).json({
      success: true,
      message: "Sub Category created successfully",
    });
  },
);

// Update a sub category

export const updateSubCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name }: { name: string } = req.body;
    const { id } = req.params;

    if (!name?.trim()) {
      throw new Error("The name of the category is required");
    }

    const subCategory = await prisma.subCategory.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!subCategory) {
      throw new Error("Sub category not found!");
    }

    await prisma.subCategory.update({
      where: {
        id: String(id),
      },
      data: {
        name: name.trim(),
      },
    });

    const category = await prisma.category.findUnique({
      where: {
        id: subCategory.categoryId,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (category.isPopular) {
      const popularCategories = await prisma.category.findMany({
        where: {
          isPopular: true,
        },
        include: {
          subCategories: true
        }
      });

      await redis.set("popular-categories", JSON.stringify(popularCategories));
    }

    res.status(200).json({
      success: true,
      message: "Sub Ccategory updated successfully",
    });
  },
);

// Delete a sub category

export const deleteSubCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const subCategory = await prisma.subCategory.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!subCategory) {
      throw new Error("Sub category not found!");
    }

    await prisma.subCategory.delete({
      where: {
        id: String(id),
      },
    });

    const category = await prisma.category.findUnique({
      where: {
        id: subCategory.categoryId,
      },
      include: {
        subCategories: true
      }
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (category.isPopular) {
      const popularCategories = await prisma.category.findMany({
        where: {
          isPopular: true,
        },
        include: {
          subCategories: true
        }
      });

      await redis.set("popular-categories", JSON.stringify(popularCategories));
    }

    res.status(200).json({
      success: true,
      message: "Sub Ccategory deleted successfully",
    });
  },
);
