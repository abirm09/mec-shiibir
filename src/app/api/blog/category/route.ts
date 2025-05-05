import { PrismaClient } from "@/generated/prisma";
import { catchAsync, SuccessResponse } from "@/lib";
import { blogCategorySchema } from "@/lib/zod/blog/category/category.schema";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
    const body = await req.json();
    const data = blogCategorySchema.parse(body);

    await prisma.blogCategory.create({
      data,
    });

    return SuccessResponse(200, "Blog category created successfully!");
  },
  { checkAuth: true }
);
