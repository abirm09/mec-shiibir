import { Box } from "@/components";
import BlogTable from "./blogTable/BlogTable";
import CreateBlog from "./createBlog/CreateBlog";

const BlogClientWrapper = () => {
  return (
    <Box className="space-y-5">
      <h4 className="font-bold text-lg font-poppins">Blogs</h4>
      <hr />
      <CreateBlog />
      <BlogTable />
    </Box>
  );
};

export default BlogClientWrapper;
