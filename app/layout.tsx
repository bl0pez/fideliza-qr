import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { WebVitals } from "@/components/analytics/web-vitals";
import { SoftwareApplicationJsonLd } from "@/components/seo/json-ld";
import { APP_NAME, APP_DESCRIPTION, getSiteUrl } from "@/lib/constants";
import { getCurrentUser } from "@/app/actions/auth";
import { RealtimeWalletListener } from "@/components/rewards/realtime-wallet-listener";
import "./globals.css";
import { plusJakartaSans } from "@/app/config/fonts";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${APP_NAME} — Fidelización de clientes con QR`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "fidelización",
    "clientes",
    "QR",
    "programa de lealtad",
    "recompensas",
    "comercio local",
    "tarjeta de puntos digital",
    "fidelizar clientes",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} — Fidelización de clientes con QR`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Fidelización de clientes con QR`,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="es">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <SoftwareApplicationJsonLd />
        <GoogleAnalytics />
        <WebVitals />
        {user && <RealtimeWalletListener userId={user.id} />}
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
