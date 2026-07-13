import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-center">
      <p className="text-6xl font-semibold text-primary">404</p>
      <h1 className="text-xl font-medium">Página não encontrada</h1>
      <p className="text-sm text-muted-foreground">O endereço acessado não existe ou foi movido.</p>
      <Button asChild className="mt-2">
        <Link href="/dashboard">Voltar para o dashboard</Link>
      </Button>
    </main>
  );
}
