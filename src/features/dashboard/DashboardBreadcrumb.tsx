"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const DashboardBreadcrumb = () => {
  const pathNames = usePathname().split("/").filter(Boolean);
  return (
    <Breadcrumb className="font-poppins">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathNames.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <Link
                href={`/${pathNames.slice(0, index + 1).join("/")}`}
                className="capitalize"
              >
                {item.split("-").join(" ").length > 12
                  ? item.split("-").join(" ").slice(0, 12) + "..."
                  : item.split("-").join(" ")}
              </Link>
            </BreadcrumbItem>
            {index < pathNames.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
