"use client"

import { QRCodeSVG } from "qrcode.react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Gift, QrCode } from "lucide-react"

interface RedeemQrModalProps {
  businessId: string
  userId: string
  rewardId: string
  rewardTitle: string
  scansRequired: number
}

export function RedeemQrModal({ businessId, userId, rewardId, rewardTitle, scansRequired }: RedeemQrModalProps) {
  // Construct the secure scanning URL for the business owner
  // We use the full origin (e.g. https://fidelilocal.com) so the QR works reliably with native cameras
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const scanUrl = `${baseUrl}/scan/redeem?b=${businessId}&u=${userId}&r=${rewardId}`

  return (
    <Dialog>
      <DialogTrigger render={
        <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 mt-2">
          <Gift className="w-4 h-4 mr-1.5" />
          CANJEAR PREMIO
        </Button>
      } />
      
      <DialogContent className="sm:max-w-md flex flex-col items-center text-center p-8 bg-card border-border shadow-2xl">
        <DialogHeader className="items-center mb-4">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-500/5">
            <Gift className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">Canjear Premio</DialogTitle>
          <DialogDescription className="text-base mt-2 max-w-[280px]">
            Muestra este código al cajero para reclamar: 
            <strong className="block text-foreground mt-1">{rewardTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white p-4 rounded-3xl border border-border shadow-inner">
          <QRCodeSVG 
            value={scanUrl} 
            size={220}
            level="H"
            includeMargin={true}
            className="rounded-xl mx-auto"
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 bg-secondary/50 px-4 py-2 rounded-full border border-border">
             Costo: <span className="font-bold text-emerald-600">{scansRequired} Visitas</span>
          </p>
        </div>

      </DialogContent>
    </Dialog>
  )
}
