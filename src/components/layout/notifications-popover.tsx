"use client";

import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNotificationsStore } from "@/store/notifications-store";

export function NotificationsPopover() {
  const { notifications, unreadCount, markAllRead } = useNotificationsStore();

  return (
    <Popover onOpenChange={(open) => open && markAllRead()}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notificações${unreadCount ? ` (${unreadCount} não lidas)` : ""}`}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3 font-medium">Notificações</div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhuma notificação por enquanto.
            </p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="border-b px-4 py-3 last:border-0">
                <p className="text-sm font-medium">{notification.title}</p>
                {notification.description && (
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
