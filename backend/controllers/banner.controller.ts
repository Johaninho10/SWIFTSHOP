import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "../lib/cloudinary";
import prisma from "../lib/prisma";
import redis from "../lib/redis";

export const getImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const images = JSON.parse(String(await redis.get("banner-images")));

    res.status(200).json({
      success: true,
      images,
    });
  },
);

export const createImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) {
      throw new Error("You must provide an image");
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: "banner-images",
    });

    await prisma.bannerImage.create({
      data: {
        url: result.secure_url,
      },
    });

    const images = await prisma.bannerImage.findMany();

    await redis.set("banner-images", JSON.stringify(images));

    res.status(201).json({
      success: true,
      message: "Image created successfully!",
    });
  },
);

export const deleteImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const images: { id: string; url: string }[] = JSON.parse(
      String(await redis.get("banner-images")),
    );

    if (images.length === 1) {
      throw new Error("There must be at least one banner image");
    }

    await prisma.bannerImage.delete({
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
