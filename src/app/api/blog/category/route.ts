import { PrismaClient } from "@/generated/prisma";
import { catchAsync, SuccessResponse } from "@/lib";
import { blogCategorySchema } from "@/lib/zod/blog/category/category.schema";
import { z } from "zod";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
    const body = await req.json();
    const data = blogCategorySchema.parse(body);

    await prisma.blogCategory.create({
      data,
    });

    return SuccessResponse(201, "Blog category created successfully!");
  },
  { checkAuth: true }
);

export const GET = catchAsync(
  async () => {
    const result = await prisma.blogCategory.findMany({
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return SuccessResponse(200, "Blog category retrieved successfully!", {
      categories: result,
    });
  },
  { checkAuth: false }
);

export const PATCH = catchAsync(
  async (req: Request) => {
    const body = await req.json();

    const data = z
      .object({
        id: z.string({ required_error: "Updated category ID is required!" }),
        name: z.string({ required_error: "Updated name is required!" }),
      })
      .parse(body);

    const result = await prisma.blogCategory.update({
      where: {
        id: data.id,
      },
      data: { name: data.name },
    });

    return SuccessResponse(200, "Blog category updated successfully!", {
      categories: result,
    });
  },
  { checkAuth: true }
);
