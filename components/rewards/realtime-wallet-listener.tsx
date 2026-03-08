"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface RealtimeWalletListenerProps {
  /** The authenticated user's ID to filter Realtime events */
  userId: string;
}

/**
 * Invisible component that subscribes to Supabase Realtime changes
 * on the `business_customers` table for the current user.
 * 
 * When the admin scans the client's QR (UPDATE on scans_count),
 * this fires a toast notification and triggers a `router.refresh()`
 * to re-fetch the server component data without a full page reload.
 */
export function RealtimeWalletListener({ userId }: RealtimeWalletListenerProps) {
  const router = useRouter();
  const subscribedRef = useRef(false);

  useEffect(() => {
    // Prevent double-subscription in React StrictMode
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const supabase = createClient();

    console.log("[Realtime] Subscribing to wallet updates for user:", userId);

    const channel = supabase
      .channel(`wallet-updates-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reward_progress",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("[Realtime] Received update:", payload);

          const oldCount = (payload.old as Record<string, number>)?.scans_count;
          const newCount = (payload.new as Record<string, number>)?.scans_count;

          if (oldCount !== undefined && newCount !== undefined) {
             if (newCount > oldCount) {
               toast.success(
                 `🎉 ¡Visita registrada! Ahora tienes ${newCount} visitas en esta recompensa.`,
                 { duration: 5000 }
               );
               // Broadcast the event so we can close the specific modal
               if (typeof window !== "undefined") {
                 window.dispatchEvent(new CustomEvent('reward-scanned', { 
                   detail: { rewardId: (payload.new as Record<string, string>).reward_id } 
                 }));
               }
             } else if (newCount < oldCount) {
               toast.success(
                 `🎁 ¡Premio canjeado exitosamente! Te quedan ${newCount} visitas.`,
                 { duration: 5000 }
               );
             }
          }

          // Refresh the server components to show updated data
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reward_progress",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("[Realtime] Received insert:", payload);
          const newCount = (payload.new as Record<string, number>)?.scans_count;
          
          if (newCount !== undefined) {
             toast.success(
                `🎉 ¡Primera visita registrada! Ahora tienes ${newCount} visita/s.`,
                { duration: 5000 }
             );
             if (typeof window !== "undefined") {
               window.dispatchEvent(new CustomEvent('reward-scanned', { 
                 detail: { rewardId: (payload.new as Record<string, string>).reward_id } 
               }));
             }
          }
          router.refresh();
        }
      )
      .subscribe((status) => {
        console.log("[Realtime] Channel status:", status);
      });

    return () => {
      console.log("[Realtime] Unsubscribing from wallet updates");
      subscribedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  // This component renders nothing — it's purely a side-effect listener
  return null;
}
