import { SidebarTrigger } from "@/components/ui";
import DashboardBreadcrumb from "./DashboardBreadcrumb";

const DashboardTopHeader = () => {
  return (
    <div className="p-4 flex gap-2 items-center bg-white">
      <SidebarTrigger />
      <span className="w-[2px] bg-gray-400 h-5"></span>
      <DashboardBreadcrumb />
    </div>
  );
};

export default DashboardTopHeader;
