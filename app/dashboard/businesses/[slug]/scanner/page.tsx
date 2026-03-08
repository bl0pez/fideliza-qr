import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, ScanLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ZxingScanner } from "@/components/scan/zxing-scanner";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Escáner QR | ${APP_NAME}`,
};

export default async function ScannerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/dashboard/businesses/${slug}/scanner`);
  }

  // Verify ownership by slug
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("slug", slug)
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    notFound();
  }

  // Build the allowed origin from environment or headers
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <ScanLine className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            {business.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            Escanea el código QR del cliente para sumar visitas o canjear
            recompensas.
          </p>
        </div>

        {/* Scanner */}
        <ZxingScanner allowedOrigin={origin} />

        {/* Back link */}
        <div className="text-center">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            nativeButton={false}
            render={
              <Link href={`/dashboard/businesses/${slug}`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al panel
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
}
