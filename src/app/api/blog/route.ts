import { PrismaClient } from "@/generated/prisma";
import { ApiError, catchAsync, slugify, SuccessResponse } from "@/lib";
import { paginationHelper } from "@/lib/paginationHelper/paginationHelper";
import { blogSchema, updateBlogSchema } from "@/lib/zod";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const POST = catchAsync(
  async (req: Request) => {
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

      return SuccessResponse(201, "Blog created successfully!");
    });
  },
  { checkAuth: true }
);

export const GET = catchAsync(
  async (req: Request) => {
    const categoryId =
      new URL(req.url).searchParams.get("categoryId") || undefined;
    const { page, limit, skip } = paginationHelper(req.url);

    const andCondition = {
      blogCategoryRelation: { some: { categoryId } },
    };

    const whereCondition = { where: { ...andCondition } };

    const result = await prisma.blog.findMany({
      ...whereCondition,
      select: {
        id: true,
        title: true,
        slug: true,
        body: true,
        thumb: true,
        blogCategoryRelation: {
          select: { category: true },
        },
      },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    });

    const total = await prisma.blog.count({ ...whereCondition });

    return SuccessResponse(
      200,
      "Blog retrieved successfully!",
      {
        blogs: result,
      },
      undefined,
      { page, limit, total }
    );
  },
  { checkAuth: false }
);

export const PUT = catchAsync(
  async (req: Request) => {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const body = formData.get("body") as string;
    const categoriesRaw = formData.get("categories") as string;
    const file = formData.get("thumb") as File | null;

    if (!id) throw new ApiError(400, "Blog ID is required");

    const blogRawData = {
      title,
      slug: slug ? slugify(slug) : undefined,
      body,
      categories: categoriesRaw || undefined,
    };

    const data = updateBlogSchema.parse(blogRawData);
    const existingBlog = await prisma.blog.findUnique({ where: { id } });

    if (!existingBlog) throw new ApiError(404, "Blog not found");

    if (data.slug) {
      if (data.slug !== existingBlog.slug) {
        const isSlugTaken = await prisma.blog.findUnique({
          where: { slug: data.slug },
        });
        if (isSlugTaken) throw new ApiError(400, "Slug already taken");
      }
    }

    let thumbPath = existingBlog.thumb;

    if (file && typeof file !== "string") {
      if (existingBlog.thumb) {
        const oldThumbPath = path.join(
          process.cwd(),
          "public",
          existingBlog.thumb
        );
        try {
          await unlink(oldThumbPath);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("Failed to delete old thumb:", err); // Log but don't throw
        }
      }

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

      thumbPath = `/uploads/blogs/${timestamp}/${fileName}`;
    }

    return prisma.$transaction(async (tx) => {
      await tx.blog.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          body: data.body,
          thumb: thumbPath,
        },
      });

      if (blogRawData.categories) {
        await tx.blogCategoryRelation.deleteMany({ where: { blogId: id } });

        await tx.blogCategoryRelation.createMany({
          data: categoriesRaw.split(",").map((catId: string) => ({
            blogId: id,
            categoryId: catId.trim(),
          })),
        });
      }

      return SuccessResponse(200, "Blog updated successfully!");
    });
  },
  { checkAuth: true }
);

export const DELETE = catchAsync(
  async (req: Request) => {
    const body = await req.json();
    const existingBlog = await prisma.blog.findUnique({
      where: { id: body.id },
    });

    if (!existingBlog) throw new ApiError(404, "Blog not found");

    if (existingBlog.thumb) {
      const oldThumbPath = path.join(
        process.cwd(),
        "public",
        existingBlog.thumb
      );
      try {
        await unlink(oldThumbPath);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Failed to delete old thumb:", err); // Log but don't throw
      }
    }

    return prisma.$transaction(async (tx) => {
      await tx.blog.delete({ where: { id: existingBlog.id } });

      await tx.blogCategoryRelation.deleteMany({
        where: { blogId: existingBlog.id },
      });

      return SuccessResponse(200, "Blog deleted successfully!");
    });
  },
  { checkAuth: true }
);
