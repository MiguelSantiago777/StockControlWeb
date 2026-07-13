"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Produtos",
  categories: "Categorias",
  customers: "Clientes",
  orders: "Pedidos",
  suppliers: "Fornecedores",
  drivers: "Entregadores",
  map: "Mapa",
  users: "Usuários",
  reports: "Relatórios",
  profile: "Perfil",
  settings: "Configurações",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Trilha de navegação" className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
      <Link href="/dashboard" className="hover:text-foreground">
        Início
      </Link>
      {segments.map((segment, i) => {
        const href = `/${segments.slice(0, i + 1).join("/")}`;
        const isLast = i === segments.length - 1;
        const label = LABELS[segment] ?? segment;
        return (
          <Fragment key={href}>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            {isLast ? (
              <span aria-current="page" className="font-medium text-foreground">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-foreground">
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
