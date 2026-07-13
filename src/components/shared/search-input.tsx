"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
}

export function SearchInput({ placeholder = "Pesquisar...", onSearch, className }: SearchInputProps) {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="pl-8"
        aria-label={placeholder}
      />
    </div>
  );
}
