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
          const rewardId = (payload.new as Record<string, string>)?.reward_id;

          if (newCount !== undefined) {
             // Si newCount > oldCount (o si oldCount es undefined pero sabemos que es un scan)
             if (oldCount === undefined || newCount > oldCount) {
               toast.success(
                 `🎉 ¡Visita registrada! Ahora tienes ${newCount} visitas.`,
                 { 
                   duration: 5000,
                   id: `scan-${rewardId}-${newCount}` // ID único para forzar refresco del mensaje
                 }
               );
               
               if (typeof window !== "undefined") {
                 window.dispatchEvent(new CustomEvent('reward-scanned', { 
                   detail: { rewardId } 
                 }));
               }
             } else if (newCount < oldCount) {
               toast.success(
                 `🎁 ¡Premio canjeado! Te quedan ${newCount} visitas.`,
                 { id: `redeem-${rewardId}-${newCount}` }
               );
             }
          }

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
          const rewardId = (payload.new as Record<string, string>)?.reward_id;
          
          if (newCount !== undefined) {
             toast.success(
                `🎉 ¡Primera visita registrada! Tienes ${newCount} visita.`,
                { duration: 5000, id: `insert-${rewardId}` }
             );
             if (typeof window !== "undefined") {
               window.dispatchEvent(new CustomEvent('reward-scanned', { 
                 detail: { rewardId } 
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
