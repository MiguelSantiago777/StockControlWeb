"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative hidden w-full max-w-sm md:block" role="search">
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Pesquisar no sistema..."
        className="pl-8"
        aria-label="Pesquisa global"
      />
    </form>
  );
}
