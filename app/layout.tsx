import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { WebVitals } from "@/components/analytics/web-vitals";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import "./globals.css";
import { plusJakartaSans } from "@/app/config/fonts";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <GoogleAnalytics />
        <WebVitals />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

