import CommonModal from "@/components/CommonModal/CommonModal";
import { Button } from "@/components/ui";
import { TBlog } from "@/types";
import { PencilLine } from "lucide-react";
import { useState } from "react";
import EditBlogForm from "./EditBlogForm";

const EditBlog = ({ blog }: { blog: TBlog }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <Button onClick={handleOpen}>
        <PencilLine />
      </Button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Edit blog"
        className="h-[calc(100vh-2rem)] overflow-y-auto font-poppins flex flex-col justify-start"
      >
        <EditBlogForm setOpen={setOpen} blog={blog} />
      </CommonModal>
    </div>
  );
};

export default EditBlog;
