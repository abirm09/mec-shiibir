import { Blog, BlogCategory } from "@/generated/prisma";
import { TMeta } from "../response/response";

type TBlogSlice = {
  blogs: TBlog[] | null;
  isLoading: boolean;
  meta?: TMeta;
  filters?: Record<string, unknown>;
  categories?: BlogCategory[] | null;
  isCategoryLoading: boolean;
};

type TBlog = Blog & {
  blogCategoryRelation: { category: BlogCategory }[];
};

export type { TBlog, TBlogSlice };
