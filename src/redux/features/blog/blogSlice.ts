import { BlogCategory } from "@/generated/prisma";
import { TBlog, TBlogSlice, TMeta } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TBlogSlice = {
  blogs: null,
  isLoading: true,
  meta: {
    limit: 12,
    page: 1,
    total: 0,
  },
  filters: {},
  categories: null,
  isCategoryLoading: true,
};

const blogSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setBlog: (state, { payload }: PayloadAction<TBlog[]>) => {
      state.blogs = payload;
    },
    setIsBlogLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setBlogMeta: (state, { payload }: PayloadAction<TMeta>) => {
      state.meta = payload;
    },
    setBlogCategory: (state, { payload }: PayloadAction<BlogCategory[]>) => {
      state.categories = payload;
    },
    setIsBlogCategoryLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isCategoryLoading = payload;
    },
  },
});

export const {
  setBlog,
  setIsBlogLoading,
  setBlogMeta,
  setBlogCategory,
  setIsBlogCategoryLoading,
} = blogSlice.actions;

export default blogSlice.reducer;
