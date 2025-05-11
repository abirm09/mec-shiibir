import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const Box = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("bg-white p-5 rounded-md shadow-sm", className)}>
      {children}
    </div>
  );
};

export default Box;
