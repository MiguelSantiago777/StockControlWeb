"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PackageSearch, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebar-store";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebarStore();
  const { role } = usePermissions();

  const visibleItems = navItems.filter((item) => role && item.roles.includes(role));

  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-200",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("flex h-14 items-center gap-2 border-b px-4", collapsed && "justify-center px-0")}>
          <PackageSearch className="h-6 w-6 shrink-0 text-primary" aria-hidden />
          {!collapsed && <span className="truncate font-semibold">StockControl</span>}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Menu principal">
          {visibleItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={toggle}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
      </aside>
    </>
  );
}
