// import React from "react";
// import "@/app/globals.css";
// import DashboardHeader from "./_components/dashboardHeader";
// import Sidebar from "./_components/sideber";

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="h-screen w-full bg-[#F9FAFB] dark:bg-black overflow-hidden">
//       <div className="h-full flex flex-col">
//         <DashboardHeader />
//         <div className="flex flex-1 overflow-hidden">
//           <div className="w-[300px] min-w-[16rem]">
//             <Sidebar />
//           </div>
//           <div className="flex-1 overflow-auto p-6">
//             <main className="h-full">{children}</main>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import type { ReactNode } from "react";
import "@/app/globals.css";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "./_components/dashboardHeader";
import { AppSidebar } from "./_components/sideber";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar collapsible="icon" />
        
        <SidebarInset className="flex flex-col">
          {/* Header Section */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="-ml-1 hover:bg-accent transition-colors" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <DashboardHeader />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6 space-y-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
