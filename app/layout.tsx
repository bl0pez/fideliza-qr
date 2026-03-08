import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
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
        {children}
        <Toaster position="top-right" richColors/>
      </body>
    </html>
  );
}
