"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareProfileButtonProps {
  businessName: string;
  className?: string;
  variant?: "outline" | "default" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

export function ShareProfileButton({
  businessName,
  className,
  variant = "outline",
  size = "default",
  showText = true,
}: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Definir los datos para compartir
    const shareData = {
      title: `${businessName} | Fidelilocal`,
      text: `¡Mira el perfil de fidelización de ${businessName} y empieza a ganar recompensas!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    // Intentar usar Web Share API si está disponible
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Ignorar si el usuario canceló el intercambio
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          copyToClipboard();
        }
      }
    } else {
      // Fallback a copiar al portapapeles
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      toast.error("No se pudo copiar el enlace");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleShare}
    >
      {copied ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Share2 className="h-4 w-4 mr-2" />
      )}
      {showText && "Compartir Perfil"}
    </Button>
  );
}
