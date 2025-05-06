import { PrismaClient } from "@/generated/prisma";
import { ApiError, catchAsync, SuccessResponse } from "@/lib";
import { TAccessTokenPayload } from "@/types";
import { mkdir, writeFile } from "fs/promises";
import _ from "lodash";
import path from "path";
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
