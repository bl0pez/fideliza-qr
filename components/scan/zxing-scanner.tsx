"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useZxing } from "react-zxing";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, ScanLine, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ZxingScannerProps {
  /** The base URL origin to validate QR codes belong to this app */
  allowedOrigin: string;
}

export function ZxingScanner({ allowedOrigin }: ZxingScannerProps) {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const processedRef = useRef(false);

  const handleDecodeResult = useCallback(
    (result: { getText: () => string }) => {
      if (processedRef.current) return;

      const text = result.getText();
      if (!text) return;

      // Validate that the QR URL belongs to this application
      try {
        const url = new URL(text);
        const origin = allowedOrigin || window.location.origin;

        if (url.origin !== origin) {
          toast.error("Este QR no pertenece a esta aplicación.");
          return;
        }

        // Mark as processed so we don't fire twice
        processedRef.current = true;
        setIsScanning(false);

        toast.success("¡QR detectado! Redirigiendo...");

        // Navigate to the scanned path (e.g. /scan?b=xxx&u=yyy or /scan/redeem?b=xxx&u=yyy&r=zzz)
        router.push(url.pathname + url.search);
      } catch {
        // Not a valid URL, ignore
        toast.error("El código escaneado no es una URL válida.");
      }
    },
    [allowedOrigin, router]
  );

  const { ref: videoRef } = useZxing({
    paused: !isScanning,
    onDecodeResult: handleDecodeResult,
    onError: (error) => {
      console.error("ZXing scanner error:", error);
      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        setHasPermission(false);
      }
    },
  });

  // Track when the video stream is active
  useEffect(() => {
    if (isScanning) {
      // Small delay to let the hook request permissions
      const timer = setTimeout(() => {
        if (hasPermission === null) {
          setHasPermission(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, hasPermission]);

  const handleToggle = () => {
    processedRef.current = false;
    setIsScanning((prev) => !prev);
  };

  // Permission denied state
  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center rounded-3xl border border-destructive/20 bg-destructive/5">
        <CameraOff className="h-12 w-12 text-destructive/60" />
        <div className="space-y-2">
          <p className="font-bold text-foreground">Permiso de cámara denegado</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Para escanear códigos QR, necesitas permitir el acceso a la cámara
            desde la configuración de tu navegador.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video viewport */}
      <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-3xl border-2 border-primary/30 bg-black shadow-2xl shadow-primary/10">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          playsInline
          muted
        />

        {/* Scanning overlay animation */}
        {isScanning && (
          <>
            {/* Corner markers */}
            <div className="absolute inset-6 pointer-events-none">
              {/* Top-left */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-primary rounded-tl-lg" />
              {/* Top-right */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-primary rounded-tr-lg" />
              {/* Bottom-left */}
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-primary rounded-bl-lg" />
              {/* Bottom-right */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-primary rounded-br-lg" />
            </div>

            {/* Animated scan line */}
            <div className="absolute inset-x-6 top-6 bottom-6 pointer-events-none overflow-hidden">
              <div className="h-0.5 bg-linear-to-r from-transparent via-primary to-transparent animate-scan-line" />
            </div>

            {/* Status badge */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                <ScanLine className="h-3.5 w-3.5 text-primary animate-pulse" />
                Apunta al código QR
              </div>
            </div>
          </>
        )}

        {/* Paused overlay */}
        {!isScanning && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-2">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
              <p className="text-white font-bold text-sm">Procesando...</p>
            </div>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <div className="flex justify-center">
        <Button
          onClick={handleToggle}
          variant={isScanning ? "destructive" : "default"}
          className="rounded-2xl h-12 px-6 font-bold text-sm shadow-lg"
        >
          {isScanning ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" /> Detener Cámara
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" /> Reanudar Escáner
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
