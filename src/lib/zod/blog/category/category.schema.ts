import { z } from "zod";

export const blogCategorySchema = z.object({
  name: z.string({ required_error: "Category name is required" }),
});
