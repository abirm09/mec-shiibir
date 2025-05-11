import { BlogClientWrapper, FetchBlogData } from "@/features/dashboard";
import BlogCategoryClientWrapper from "@/features/dashboard/blog/categorySide/BlogCategoryClientWrapper";

const BlogPage = () => {
  return (
    <>
      <FetchBlogData />
      <div className="grid lg:grid-cols-2 gap-5">
        <BlogClientWrapper />
        <BlogCategoryClientWrapper />
      </div>
    </>
  );
};

export default BlogPage;
