"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CustomerQrModalProps {
  businessId: string;
  userId: string;
  rewardId?: string;
  rewardTitle?: string;
}

export function CustomerQrModal({ businessId, userId, rewardId, rewardTitle }: CustomerQrModalProps) {
  // Control global de apertura del modal
  const [open, setOpen] = useState(false);

  // Construimos una URL de escaneo absoluta simulada (en producción debería usar process.env.NEXT_PUBLIC_SITE_URL o el host)
  // Como estamos en un client component, podemos usar window.location.origin
  const scanUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/scan?b=${businessId}&u=${userId}${rewardId ? `&r=${rewardId}` : ''}`
    : `https://fidelilocal.vercel.app/scan?b=${businessId}&u=${userId}${rewardId ? `&r=${rewardId}` : ''}`;

  useEffect(() => {
    const handleScanEvent = (e: CustomEvent<{ rewardId: string }>) => {
      // Si el escaneo es de la recompensa actual, cerrar el modal
      if (e.detail?.rewardId === rewardId) {
        setOpen(false);
      }
    };
    
    // Escuchar evento custom del RealtimeListener
    window.addEventListener('reward-scanned', handleScanEvent as EventListener);
    
    return () => {
      window.removeEventListener('reward-scanned', handleScanEvent as EventListener);
    };
  }, [rewardId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="w-full h-14 md:h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <QrCode className="mr-2 h-6 w-6" />
          {rewardId ? 'CÓDIGO DE RECOMPENSA' : 'MOSTRAR CÓDIGO QR'}
        </Button>
      } />
      
      <DialogContent className="sm:max-w-md flex flex-col items-center text-center p-8 bg-card border-border shadow-2xl">
        <DialogHeader className="items-center mb-4">
          <DialogTitle className="text-2xl font-black">Tu Código de Cliente</DialogTitle>
          <DialogDescription className="text-base">
            {rewardTitle ? (
              <>Muestra este código para sumar una visita a la recompensa: <strong>{rewardTitle}</strong>.</>
            ) : (
              "Muestra este código en caja al hacer tu compra para sumar una visita."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white p-6 rounded-3xl shadow-inner my-4 border border-zinc-200">
          <QRCodeSVG 
            value={scanUrl} 
            size={220} 
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "/icon-192x192.png", // Usa un logo o icono de la app si lo tienes
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground font-medium mt-2">
          El código es único y personal.
        </p>
      </DialogContent>
    </Dialog>
  );
}
