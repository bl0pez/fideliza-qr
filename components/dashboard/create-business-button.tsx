"use client";

import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateBusinessButton() {
  const router = useRouter();

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
