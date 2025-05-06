import { z } from "zod";

export const blogSchema = z.object({
  title: z.string({ required_error: "Blog title is required" }),
  slug: z.string({ required_error: "Slug is required" }),
  body: z.string({ required_error: "Body is required" }),
  thumb: z.string().optional(), // This field is required. The validation is handling from the service logic
  categories: z.string({ required_error: "Categories is required" }),
});

export const updateBlogSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  body: z.string().optional(),
  thumb: z.string().optional(),
  categories: z.string().optional(),
});
