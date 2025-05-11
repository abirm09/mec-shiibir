import { Box } from "@/components";
import BlogCategoryTable from "./blogCategoryTable/BlogCategoryTable";
import CreateBlogCategory from "./createBlogCategory/CreateBlogCategory";

const BlogCategoryClientWrapper = () => {
  return (
    <Box className="space-y-5">
      <h4 className="font-bold text-lg font-poppins">Blog categories</h4>
      <hr />
      <CreateBlogCategory />
      <BlogCategoryTable />
    </Box>
  );
};

export default BlogCategoryClientWrapper;
