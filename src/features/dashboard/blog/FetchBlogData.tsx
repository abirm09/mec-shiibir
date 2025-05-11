"use client";

import { BlogCategory } from "@/generated/prisma";
import {
  useGetBlogCategoriesQuery,
  useGetBlogsQuery,
} from "@/redux/features/blog/blogApi";
import {
  setBlog,
  setBlogCategory,
  setBlogMeta,
  setIsBlogLoading,
} from "@/redux/features/blog/blogSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TBlog } from "@/types";
import { useEffect } from "react";

const FetchBlogData = () => {
  const { filters } = useAppSelector(({ blog }) => blog);
  const dispatch = useAppDispatch();
  const { data: blogResponse, isLoading } = useGetBlogsQuery(filters);
  const blogs = (blogResponse?.data?.blogs as TBlog[]) || null;
  const meta = blogResponse?.meta;

  const { data: categoriesResponse } = useGetBlogCategoriesQuery({});
  const categories =
    (categoriesResponse?.data?.categories as BlogCategory[]) || null;

  useEffect(() => {
    dispatch(setBlog(blogs));
    dispatch(setIsBlogLoading(isLoading));
    dispatch(setBlogMeta(meta));
    dispatch(setBlogCategory(categories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs, isLoading, meta, categories]);

  return null;
};

export default FetchBlogData;
