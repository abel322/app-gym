"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function DashboardLayout({
  children,
  title,
  description,
}: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Header
            title={title}
            description={description}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />
          <main className="flex-1 p-3 sm:p-6 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}