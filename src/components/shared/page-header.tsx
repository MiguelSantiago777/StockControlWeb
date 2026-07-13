import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Início
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
