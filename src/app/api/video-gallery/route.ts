import { PrismaClient } from "@/generated/prisma";
import { catchAsync, SuccessResponse } from "@/lib";
import { videoGallery } from "@/lib/zod/videoGallery/videoGallery.schema";
import { TAccessTokenPayload } from "@/types";
import _ from "lodash";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
    const user = _.get(req, "user") as unknown as TAccessTokenPayload;
    const body = await req.json();
    const data = videoGallery.parse(body);

    await prisma.videoGallery.create({
      data: { ...data, createdByUserId: user.userId },
    });

    return SuccessResponse(200, "Video gallery created successfully!");
  },
  { checkAuth: true }
);
