import searchParams from "@/lib/searchParams/searchParams";
import baseApi from "@/redux/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: (params?: Record<string, unknown>) => ({
        url: `/blog`,
        params: searchParams(params),
      }),
      providesTags: ["blog"],
    }),
    createBlog: builder.mutation({
      query: (body) => ({
        url: "/blog",
        method: "POST",
        body,
      }),
      invalidatesTags: ["blog"],
    }),
    getBlogCategories: builder.query({
      query: (params?: Record<string, unknown>) => ({
        url: `/blog/category`,
        params: searchParams(params),
      }),
      providesTags: ["blogCategory"],
    }),
    createBlogCategory: builder.mutation({
      query: (body) => ({
        url: "/blog/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["blogCategory"],
    }),
    updateBlogCategory: builder.mutation({
      query: (body) => ({
        url: "/blog/category",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["blogCategory"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useCreateBlogMutation,
} = blogApi;
