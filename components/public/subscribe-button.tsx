"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { subscribeToBusiness } from "@/app/actions/subscription";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

interface SubscribeButtonProps {
  businessId: string;
  slug: string;
}

export function SubscribeButton({ businessId, slug }: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    const result = await subscribeToBusiness(businessId, slug);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("¡Te has suscrito exitosamente!");
    }
  };

  return (
    <Button 
      onClick={handleSubscribe} 
      disabled={isLoading}
      className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
      ) : (
        <UserPlus className="h-5 w-5 mr-2" />
      )}
      {isLoading ? "SUSCRIBIENDO..." : "SUSCRIBIRME Y GANAR"}
    </Button>
  );
}
