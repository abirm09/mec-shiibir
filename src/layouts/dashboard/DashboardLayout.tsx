import { SidebarProvider } from "@/components/ui";
import { DashboardSideBar, DashboardTopHeader } from "@/features/dashboard";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <main className="w-full">
        <SidebarProvider>
          <DashboardSideBar />
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
