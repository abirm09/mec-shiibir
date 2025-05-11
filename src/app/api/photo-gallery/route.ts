import { PrismaClient } from "@/generated/prisma";
import { ApiError, catchAsync, SuccessResponse } from "@/lib";
import { paginationHelper } from "@/lib/paginationHelper/paginationHelper";
import { TAccessTokenPayload } from "@/types";

import _ from "lodash";
import { z } from "zod";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
    const { mkdir, writeFile } = await import("fs/promises"); // ✅ dynamic import
    const path = await import("path"); // ✅ dynamic import
    const user = _.get(req, "user") as unknown as TAccessTokenPayload;

    const formData = await req.formData();

    const { title } = z
      .object({ title: z.string({ required_error: "Title is required!" }) })
      .parse({ title: formData.get("title") });
    const image = formData.get("image") as File;

    if (!image || typeof image === "string") {
      throw new ApiError(400, "Thumb is required");
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${image.name}`;

    const timestamp = Date.now();
    const folderPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "photo-gallery",
      `${timestamp}`
    );
    const uploadPath = path.join(folderPath, fileName);

    await mkdir(folderPath, { recursive: true });
    await writeFile(uploadPath, buffer);

    await prisma.photoGallery.create({
      data: {
        title,
        image: `/uploads/photo-gallery/${timestamp}/${fileName}`,
        createdByUserId: user.userId,
      },
    });

    return SuccessResponse(200, "Photo gallery created successfully!");
  },
  { checkAuth: true }
);

export const GET = catchAsync(
  async (req: Request) => {
    const { page, limit, skip } = paginationHelper(req.url);

    const result = await prisma.photoGallery.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      skip,
      take: limit,
    });

    const count = await prisma.photoGallery.count();

    return SuccessResponse(
      200,
      "Photo gallery retrieved successfully!",
      { photoGallery: result },
      undefined,
      { page, limit, total: count }
    );
  },
  { checkAuth: false }
);

export const DELETE = catchAsync(
  async (req: Request) => {
    const body = await req.json();
    const { unlink } = await import("fs/promises"); // ✅ dynamic import
    const path = await import("path"); // ✅ dynamic import

    const { id } = z
      .object({
        id: z.string({ required_error: "Id is required!" }),
      })
      .parse(body);

    const existingImage = await prisma.photoGallery.findUnique({
      where: { id },
    });
    if (!existingImage) throw new ApiError(400, "No image found!");

    if (existingImage.image) {
      const oldThumbPath = path.join(
        process.cwd(),
        "public",
        existingImage.image
      );
      try {
        await unlink(oldThumbPath);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Failed to delete old thumb:", err); // Log but don't throw
      }
    }

    await prisma.photoGallery.delete({ where: { id } });

    return SuccessResponse(200, "Media published news deleted successfully!");
  },
  { checkAuth: true }
);
