"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <DropdownMenuItem 
      onClick={handleSignOut}
      className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Cerrar sesión</span>
    </DropdownMenuItem>
  );
}
