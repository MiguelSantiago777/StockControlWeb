import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value?: string | number;
  icon: LucideIcon;
  isLoading?: boolean;
  tone?: "default" | "warning" | "destructive";
}

export function StatCard({ title, value, icon: Icon, isLoading, tone = "default" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            tone === "default" && "bg-primary/10 text-primary",
            tone === "warning" && "bg-warning/15 text-warning",
            tone === "destructive" && "bg-destructive/10 text-destructive"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-16" />
          ) : (
            <p className="text-2xl font-semibold tabular-nums">{value ?? "—"}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
