import { PrismaClient } from "@/generated/prisma";
import { ApiError, catchAsync, slugify, SuccessResponse } from "@/lib";
import { blogSchema } from "@/lib/zod";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const POST = catchAsync(async (req: Request) => {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const body = formData.get("body") as string;
  const categoriesRaw = formData.get("categories") as string;
  const file = formData.get("thumb") as File;

  const blogRawData = {
    title,
    slug: slugify(slug),
    body,
    categories: categoriesRaw,
  };

  const data = blogSchema.parse(blogRawData);

  if (!file || typeof file === "string") {
    throw new ApiError(400, "Thumb is required");
  }

  const isSlugTaken = await prisma.blog.findUnique({
    where: { slug: data.slug },
  });
  if (isSlugTaken) throw new ApiError(400, "The slug is already taken!");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${file.name}`;

  const timestamp = Date.now();
  const folderPath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "blogs",
    `${timestamp}`
  );
  const uploadPath = path.join(folderPath, fileName);

  await mkdir(folderPath, { recursive: true });

  await writeFile(uploadPath, buffer);

  return prisma.$transaction(async (tx) => {
    const blogData = {
      ...data,
      categories: undefined,
      thumb: `/uploads/blogs/${timestamp}/${fileName}`,
    };
    const blog = await tx.blog.create({
      data: blogData,
    });

    await tx.blogCategoryRelation.createMany({
      data: categoriesRaw?.split(",")?.map((id: string) => ({
        blogId: blog.id,
        categoryId: id.trim(),
      })),
    });

    return SuccessResponse(200, "Blog created successfully!");
  });
});
