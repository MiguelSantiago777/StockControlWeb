"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebar-store";
import { GlobalSearch } from "./global-search";
import { NotificationsPopover } from "./notifications-popover";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Header() {
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1">
        <NotificationsPopover />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
