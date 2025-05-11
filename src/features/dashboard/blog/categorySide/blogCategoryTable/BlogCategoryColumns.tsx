import { BlogCategory } from "@/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import BlogCategoryTitleRow from "./BlogCategoryTitleRow";

const Columns: ColumnDef<BlogCategory>[] = [
  {
    accessorKey: "",
    header: "SL",
    cell: ({ row }) => (
      <div className="capitalize">
        <span className="">{row?.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <BlogCategoryTitleRow category={row.original} />,
  },
];

export default Columns;
