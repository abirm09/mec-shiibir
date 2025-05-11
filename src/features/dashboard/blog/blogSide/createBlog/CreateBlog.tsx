"use client";

import CommonModal from "@/components/CommonModal/CommonModal";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateBlogForm from "./CreateBlogForm";

const CreateBlog = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <Button onClick={handleOpen}>
        <Plus /> Create blog
      </Button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Create new blog"
        className="h-[calc(100vh-2rem)] overflow-y-auto font-poppins flex flex-col justify-start"
      >
        <CreateBlogForm setOpen={setOpen} />
      </CommonModal>
    </div>
  );
};

export default CreateBlog;
