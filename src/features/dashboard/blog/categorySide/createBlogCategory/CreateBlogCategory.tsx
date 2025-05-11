"use client";

import { Button, Input } from "@/components/ui";
import { useCreateBlogCategoryMutation } from "@/redux/features/blog/blogApi";
import { Plus } from "lucide-react";
import { useState } from "react";

const CreateBlogCategory = () => {
  const [createMode, setCreateMode] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState<string | null>(null);

  const [createBlogCategory, { isLoading }] = useCreateBlogCategoryMutation();

  const handleCategoryCreation = async () => {
    try {
      await createBlogCategory({ name: newCategoryInput });
      setNewCategoryInput(null);
    } catch (error) {
      const err = error as Error;
      alert(err.message);
    }
  };

  return (
    <div className="flex gap-10 items-center justify-between">
      <Button onClick={() => setCreateMode((prev) => !prev)}>
        <Plus /> Create category
      </Button>

      {createMode ? (
        <div className="flex-1 flex gap-2 items-center">
          <div className="flex-1">
            <Input
              value={newCategoryInput || ""}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="New category name"
            />
          </div>
          <Button onClick={handleCategoryCreation} disabled={isLoading}>
            <Plus /> Add
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default CreateBlogCategory;
