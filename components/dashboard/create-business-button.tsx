"use client";

import { Button } from "@/components/ui/button";
import { Store, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreateBusinessButtonProps {
  disabled?: boolean;
}

export function CreateBusinessButton({ disabled = false }: CreateBusinessButtonProps) {
  const router = useRouter();

  if (disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div>
              <Button 
                disabled
                className="flex items-center gap-2 bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
              >
                <Lock className="w-4 h-4" />
                Crear Negocio
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white font-medium p-3 rounded-xl max-w-xs text-center border-none shadow-xl">
            <p>Has alcanzado el límite de sucursales de tu plan actual. Sube a Pro para agregar más.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button 
      onClick={() => router.push('/dashboard/businesses/new')} 
      className="flex items-center gap-2"
    >
      <Store className="w-4 h-4" />
      Crear Negocio
    </Button>
  );
}
