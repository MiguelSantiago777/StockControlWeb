import type { ReactNode } from "react";
import { AuthGuard } from "@/providers/auth-guard";
import { AppShell } from "@/components/layout/app-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
