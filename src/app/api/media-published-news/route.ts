import { PrismaClient } from "@/generated/prisma";
import { ApiError, catchAsync, SuccessResponse } from "@/lib";
import { paginationHelper } from "@/lib/paginationHelper/paginationHelper";
import { TAccessTokenPayload } from "@/types";
import { mkdir, unlink, writeFile } from "fs/promises";
import _ from "lodash";
import path from "path";
import { z } from "zod";
import { mediaPublishedNews } from "../../../lib/zod/mediaPublishedNews/mediaPublishedNews.schema";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
    const user = _.get(req, "user") as unknown as TAccessTokenPayload;

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const origin = formData.get("origin") as string;

    const thumb = formData.get("thumb") as File;

    const partialData = mediaPublishedNews.parse({ title, url, origin });

    if (!thumb || typeof thumb === "string") {
      throw new ApiError(400, "Thumb is required!");
    }

    const bytes = await thumb.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${thumb.name}`;

    const timestamp = Date.now();
    const folderPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "media-published-news",
      `${timestamp}`
    );
    const uploadPath = path.join(folderPath, fileName);

    await mkdir(folderPath, { recursive: true });
    await writeFile(uploadPath, buffer);

    await prisma.mediaPublishedNews.create({
      data: {
        ...partialData,
        thumb: `/uploads/media-published-news/${timestamp}/${fileName}`,
        createdByUserId: user.userId,
      },
    });

    return SuccessResponse(200, "Media published news created successfully!");
  },
  { checkAuth: true }
);

export const GET = catchAsync(
  async (req: Request) => {
    const { page, limit, skip } = paginationHelper(req.url);

    const result = await prisma.mediaPublishedNews.findMany({
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

    const count = await prisma.mediaPublishedNews.count();

    return SuccessResponse(
      200,
      "Media published news retrieved successfully!",
      { mediaPublishedNews: result },
      undefined,
      { page, limit, total: count }
    );
  },
  { checkAuth: false }
);
export const DELETE = catchAsync(
  async (req: Request) => {
    const body = await req.json();

    const { id } = z
      .object({
        id: z.string({ required_error: "Id is required!" }),
      })
      .parse(body);

    const existingNews = await prisma.mediaPublishedNews.findUnique({
      where: { id },
    });
    if (!existingNews) throw new ApiError(400, "No news found!");

    if (existingNews.thumb) {
      const oldThumbPath = path.join(
        process.cwd(),
        "public",
        existingNews.thumb
      );
      try {
        await unlink(oldThumbPath);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Failed to delete old thumb:", err); // Log but don't throw
      }
    }

    await prisma.mediaPublishedNews.delete({ where: { id } });

    return SuccessResponse(200, "Media published news deleted successfully!");
  },
  { checkAuth: false }
);
