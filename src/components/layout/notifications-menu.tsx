"use client";

import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationsStore } from "@/store/notifications-store";

export function NotificationsMenu() {
  const { notifications, unreadCount, markAllAsRead } = useNotificationsStore();

  return (
    <DropdownMenu onOpenChange={(open) => open && markAllAsRead()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Notificações${unreadCount ? ` (${unreadCount} não lidas)` : ""}`} className="relative">
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" aria-hidden />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">Sem notificações.</p>
        ) : (
          notifications.slice(0, 8).map((n) => (
            <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5">
              <span className="font-medium">{n.title}</span>
              <span className="text-xs text-muted-foreground">{n.message}</span>
              <span className="text-[11px] text-muted-foreground/70">
                {formatDistanceToNow(n.createdAt, { addSuffix: true, locale: ptBR })}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
