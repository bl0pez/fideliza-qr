import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

export const dynamic = 'force-dynamic';

function getPreApprovalClient() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return null;
  return new PreApproval(new MercadoPagoConfig({ accessToken: token }));
}

const buildAdminSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    // MercadoPago can send payload id in URL query string
    const topic = url.searchParams.get("topic");
    const id = url.searchParams.get("id");

    if (!topic || !id) {
      return NextResponse.json({ success: true, message: "No action required" }, { status: 200 });
    }

    // Only process subscription webhooks
    if (topic === "subscription_preapproval" || topic === "preapproval") {
      const preapproval = getPreApprovalClient();
      if (!preapproval) {
         console.error("MP_ACCESS_TOKEN missing in webhook handler");
         return NextResponse.json({ error: "Config error" }, { status: 500 });
      }

      // 1. Fetch true state to prevent spoofing
      const subscriptionInfo = await preapproval.get({ id });

      if (subscriptionInfo && subscriptionInfo.external_reference) {
         let metadata: { userId: string, planId: string } | null = null;
         try {
           metadata = JSON.parse(subscriptionInfo.external_reference);
         } catch (e) {
           console.error("Could not parse metadata from MP", e);
         }

         if (metadata && metadata.userId && metadata.planId) {
            const supabaseAdmin = buildAdminSupabase();
            const status = mapMercadoPagoStatus(subscriptionInfo.status);
            
            // 2. Check if user already has a subscription
            const { data: existingSub } = await supabaseAdmin
              .from("owner_subscriptions")
              .select("id")
              .eq("owner_id", metadata.userId)
              .single();

            const payloadData = {
              owner_id: metadata.userId,
              plan_id: metadata.planId,
              status: status,
              provider: 'mercadopago',
              provider_subscription_id: subscriptionInfo.id,
              current_period_start: subscriptionInfo.date_created || new Date().toISOString(),
              current_period_end: subscriptionInfo.next_payment_date || new Date().toISOString(), 
              cancel_at_period_end: status === 'canceled',
              updated_at: new Date().toISOString()
            };

            // 3. Upsert subscription data
            if (existingSub) {
              await supabaseAdmin
                .from("owner_subscriptions")
                .update(payloadData)
                .eq("owner_id", metadata.userId);
            } else {
              await supabaseAdmin
                .from("owner_subscriptions")
                .insert([payloadData]);
            }
         }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

function mapMercadoPagoStatus(mpStatus: string | undefined): 'active' | 'past_due' | 'canceled' | 'incomplete' {
  switch (mpStatus) {
    case 'authorized':
      return 'active';
    case 'paused':
    case 'cancelled':
      return 'canceled';
    case 'pending':
      return 'incomplete';
    default:
      return 'incomplete';
  }
}
