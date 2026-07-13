"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_SIZE_MB = 5;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface UploadImageProps {
  value?: string;
  progress?: number;
  onSelect: (file: File) => void;
  onClear?: () => void;
  className?: string;
}

export function UploadImage({ value, progress, onSelect, onClear, className }: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const src = preview ?? value;
  const uploading = progress !== undefined && progress < 100;

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`A imagem deve ter no máximo ${MAX_SIZE_MB} MB.`);
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
    onSelect(file);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {src ? (
        <div className="relative h-36 w-36 overflow-hidden rounded-lg border">
          <Image src={src} alt="Pré-visualização" fill className="object-cover" unoptimized />
          {onClear && !uploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6"
              onClick={() => {
                setPreview(null);
                onClear();
              }}
              aria-label="Remover imagem"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ImagePlus className="h-6 w-6" aria-hidden />
          <span className="text-xs">Enviar imagem</span>
        </button>
      )}

      {uploading && (
        <div className="h-1.5 w-36 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress}>
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
