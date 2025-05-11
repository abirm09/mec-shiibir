import { Input } from "@/components/ui";
import { BlogCategory } from "@/generated/prisma";
import { useUpdateBlogCategoryMutation } from "@/redux/features/blog/blogApi";
import { useEffect, useRef, useState } from "react";

const BlogCategoryTitleRow = ({ category }: { category: BlogCategory }) => {
  const [updateBlog] = useUpdateBlogCategoryMutation();

  const [editable, setEditable] = useState(false);
  const [value, setValue] = useState(category.name);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCategoryUpdate = async () => {
    setEditable(false);

    if (value === category.name) return;

    try {
      await updateBlog({ id: category.id, name: value }).unwrap();
    } catch (error) {
      const err = error as Error;
      alert(err.message);
    }
  };

  useEffect(() => {
    if (editable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editable]);

  return (
    <div>
      {editable ? (
        <div>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleCategoryUpdate}
            className="max-w-xs"
          />
        </div>
      ) : (
        <div>
          <h4 onClick={() => setEditable(true)} title="Click to edit">
            {category.name}
          </h4>
        </div>
      )}
    </div>
  );
};

export default BlogCategoryTitleRow;
