import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { TBlog } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import EditBlog from "./EditBlog";

const Columns: ColumnDef<TBlog>[] = [
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
    accessorKey: "thumb",
    header: "Thumbnail",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original?.thumb} alt={row.original?.title} />
        <AvatarFallback>{row.original?.title}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div>
        <p>
          {row.original?.title?.length > 50
            ? `${row.original?.title.slice(0, 50)}...`
            : row.original?.title}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "edit",
    header: "Edit",
    cell: ({ row }) => <EditBlog blog={row.original} />,
  },
];

export default Columns;
