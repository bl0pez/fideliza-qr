"use client";

import { useState } from "react";
import { ScanLine, QrCode } from "lucide-react";
import Link from "next/link";
import { QuickQrDrawer } from "@/components/layout/quick-qr-drawer";

interface QuickActionButtonProps {
  role: "business_owner" | "customer" | null;
  userId: string | null;
}

export function QuickActionButton({ role, userId }: QuickActionButtonProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!userId) return null;

  // If owner, the primary central action is scanning customers
  if (role === "business_owner") {
    return (
      <Link
        href="/scan"
        className="flex flex-col items-center justify-center -mt-8 group"
      >
        <div className="w-16 h-16 rounded-full bg-linear-to-tr from-primary to-orange-500 p-0.5 shadow-2xl shadow-primary/40 group-hover:scale-110 transition-all duration-500 group-active:scale-95">
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-primary group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
            <ScanLine className="w-8 h-8 stroke-[2.5px]" />
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest mt-2 text-primary opacity-80 group-hover:opacity-100 transition-opacity">
          Escanear
        </span>
      </Link>
    );
  }

  // If customer, the primary central action is showing their QR
  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex flex-col items-center justify-center -mt-8 group outline-hidden"
      >
        <div className="w-16 h-16 rounded-full bg-linear-to-tr from-primary to-orange-500 p-0.5 shadow-2xl shadow-primary/40 group-hover:scale-110 transition-all duration-500 group-active:scale-95 leading-none">
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-primary group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
            <QrCode className="w-8 h-8 stroke-[2.5px]" />
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest mt-2 text-primary opacity-80 group-hover:opacity-100 transition-opacity">
          Mi QR
        </span>
      </button>

      <QuickQrDrawer 
        userId={userId} 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
    </>
  );
}
