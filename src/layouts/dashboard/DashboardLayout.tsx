import { SidebarProvider } from "@/components/ui";
import DashboardSidebar from "@/features/dashboard/DashboardSideBar";
import DashboardTopHeader from "@/features/dashboard/DashboardTopHeader";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main className="w-full">
        <SidebarProvider>
          <DashboardSidebar />
          <div className="w-full bg-gray-50">
            <DashboardTopHeader />
            <div className="px-5 w-full mt-5">{children}</div>
          </div>
        </SidebarProvider>
      </main>
    </>
  );
};

export default DashboardLayout;
