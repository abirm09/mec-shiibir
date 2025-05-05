import { PrismaClient } from "@/generated/prisma";
import { ApiError, catchAsync, SuccessResponse } from "@/lib";
import { TAccessTokenPayload } from "@/types";
import { mkdir, writeFile } from "fs/promises";
import _ from "lodash";
import path from "path";
import { z } from "zod";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
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
