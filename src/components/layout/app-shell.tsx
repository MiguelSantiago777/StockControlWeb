"use client";

import type { ReactNode } from "react";
import { useSidebarStore } from "@/store/sidebar-store";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { RealtimeNotifications } from "./realtime-notifications";

export function AppShell({ children }: { children: ReactNode }) {
  const collapsed = useSidebarStore((state) => state.collapsed);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <RealtimeNotifications />
      <div className={cn("transition-all duration-200", collapsed ? "lg:pl-16" : "lg:pl-60")}>
        <Header />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
