"use client";
import dynamic from "next/dynamic";

import { Button, Checkbox, Input, Label } from "@/components/ui";
import { Blog } from "@/generated/prisma";
import { useCreateBlogMutation } from "@/redux/features/blog/blogApi";
import { useAppSelector } from "@/redux/hooks";
import { TBlog } from "@/types";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const EditBlogForm = ({
  setOpen,
  blog,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  blog: TBlog;
}) => {
  const storedCategories = blog?.blogCategoryRelation
    ?.map((item) => item.category)
    ?.map((item) => item.id);

  const [createBlogFN, { isLoading: isBlogCreatingLoading }] =
    useCreateBlogMutation();
  const { categories } = useAppSelector(({ blog }) => blog);

  // Blog body
  const editor = useRef(null);
  const [content, setContent] = useState(blog?.body);
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typings...",
      default: blog?.body,
    }),
    [blog?.body]
  );

  // Category
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(storedCategories);
  const handleCategoryClick = (id: string) => {
    if (selectedCategories.includes(id)) {
      const exceptCurrent = selectedCategories.filter((item) => item !== id);
      setSelectedCategories(exceptCurrent);
    } else {
      setSelectedCategories((prev) => [...prev, id.trim()]);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Blog>();

  const resetInput = () => {
    reset();
    setSelectedCategories([]);
    setContent("");
    setOpen(false);
  };

  const onSubmit = async (data: Blog) => {
    const categoryArrayToString = selectedCategories.join(",");
    try {
      const formData = new FormData();
      if (data.thumb && data.thumb[0]) {
        formData.append("thumb", data.thumb[0]);
      }
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      if (categoryArrayToString) {
        formData.append("categories", categoryArrayToString);
      }
      formData.append("body", data.body);

      await createBlogFN(formData).unwrap();
      resetInput();
    } catch (error) {
      const err = error as Error;
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid md:grid-cols-2 gap-5"
    >
      <div className="space-y-2">
        <Label htmlFor="edit-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-title"
          type="text"
          placeholder="Blog title"
          defaultValue={blog.title}
          {...register("title", { required: true })}
        />
        {errors.title && (
          <span className="text-destructive font-semibold ml-3 mt-2">
            This field is required
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-slug">
          Slug <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-slug"
          type="text"
          placeholder="Blog slug"
          defaultValue={blog.slug}
          {...register("slug", { required: true })}
        />
        {errors.slug && (
          <span className="text-destructive font-semibold ml-3 mt-2">
            This field is required
          </span>
        )}
      </div>
      <div className="grid w-full items-center gap-1.5 col-span-1 md:col-span-2 space-y-2">
        <Label htmlFor="edit-thumb">Thumbnail</Label>
        <Input
          id="edit-thumb"
          type="file"
          className="py-1 px-2"
          {...register("thumb")}
        />
      </div>
      <div className="space-y-2 col-span-1 md:col-span-2">
        <Label htmlFor="edit-category">
          Category <span className="text-destructive">*</span>
        </Label>
        <div>
          {/* <li key={category.id}>{category.name}</li> */}
          <ul className="grid md:grid-cols-4 space-y-2">
            {categories?.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  name="edit-category"
                  checked={
                    selectedCategories.find((item) => item === category.id)
                      ? true
                      : false
                  }
                />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-2 col-span-1 md:col-span-2">
        <Label htmlFor="edit-body">
          Body <span className="text-destructive">*</span>
        </Label>
        <JoditEditor
          id="edit-body"
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>
      <div>
        <Button disabled={isBlogCreatingLoading}>Create blog</Button>
      </div>
    </form>
  );
};

export default EditBlogForm;
