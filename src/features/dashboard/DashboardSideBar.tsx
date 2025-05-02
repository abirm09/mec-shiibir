import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import React from "react";

const DashboardSidebar = () => {
  const applicationLinks: {
    name: string;
    path?: string;
    icon?: React.JSX.Element;
    children?: {
      name: string;
      path: string;
      icon: React.JSX.Element;
    }[];
  }[] = [
    {
      name: "Metrics",
      path: "/dashboard",
      icon: <LayoutDashboard />,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-5">
        <Link href={"/dashboard"} className="font-bold">
          MEC Shibir
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {applicationLinks.map((item, index) => {
            return (
              <SidebarMenu key={item.name + index}>
                <SidebarMenuItem key={item.name + index}>
                  <SidebarMenuButton asChild>
                    <Link href={`${item.path}`}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex justify-center">
        <SidebarSeparator />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
