# Implementación PWA Nativa (Next.js 16 - Turbopack)

Para implementar capacidades Offline e Instalabilidad PWA (Progressive Web App) en Fideliza QR sin los bloqueos típicos de compiladores de terceros (como Serwist en Turbopack o `next-pwa` abandonado), ejecuta los siguientes cambios manualmente cuando el cliente decida activarlo:

## 1. Iconos Escalables (Obligatorio)

Crea un archivo vectorial estricto `public/icon.svg`. Chrome rechazará la PWA si las dimensiones internas del Manifiesto desentonan con un archivo ráster.

```xml
<!-- public/icon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#18181b"/>
  <text x="50%" y="50%" fill="white" font-size="200" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">FQ</text>
</svg>
```

## 2. Web App Manifest Dinámico

Crea `app/manifest.ts` para decirle a los navegadores sobre la PWA:

```typescript
// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fideliza QR",
    short_name: "Fideliza",
    description:
      "La forma más inteligente de fidelizar a tus clientes y premiarlos.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#18181b", // Color primario oscuro (zinc-900)
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
```

## 3. Fallback Offline (Pantalla sin internet)

Crea el archivo `app/~offline/page.tsx` para cuando falle el servidor web y el usuario abra la PWA:

```tsx
// app/~offline/page.tsx
"use client";

import { WifiOff } from "lucide-react";

export default function OfflineFallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4text-center">
      <WifiOff className="w-16 h-16 text-zinc-400 mb-6" />
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
        Estás sin conexión
      </h1>
      <p className="text-zinc-500 max-w-sm mb-8">
        No pudimos conectar con los servidores de Fideliza QR. Por favor, revisa
        tu conexión a internet e intenta nuevamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
      >
        Reintentar Conexión
      </button>
    </div>
  );
}
```

## 4. Estrategia del Service Worker

Crea el archivo estático en `public/sw.js` interrumpiendo el flujo nativo de la caché con tu Fallback Offline:

```javascript
// public/sw.js
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("fideliza-offline-v2").then(function (cache) {
      return cache.addAll(["/", "/~offline", "/icon.svg"]);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        }
        // Fallback for document requests
        if (
          event.request.destination === "document" ||
          event.request.mode === "navigate"
        ) {
          return caches.match("/~offline");
        }
      });
    }),
  );
});
```

## 5. Script de Registro (Client-Side)

Next.js 15+ (usando Turbopack de forma nativa) ignora plugins de webworkers (como `Serwist`). Por tanto, hay que inyectarlo de lado del cliente en `components/public/sw-registry.tsx`:

```tsx
// components/public/sw-registry.tsx
"use client";

import { useEffect } from "react";

export function SerwistRegistry() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}
```

## 6. Integración Global en Layout

Modifica la base del proyecto `app/layout.tsx` importando el Registro manual y adaptando el Viewport general para Apple/Android App Mode:

```tsx
// app/layout.tsx (Extractos Relevantes)
import { SerwistRegistry } from "@/components/public/sw-registry";

export const viewport: Viewport = {
  themeColor: "#18181b",
  userScalable: false, // Evita zoom en iOS para que parezca app nativa y no navegador
  // ... resto ...
};

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    title: "Fideliza",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  // ... resto ...
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="...">
        {children}
        <Toaster />
        <SerwistRegistry /> {/* <--- AÑADIR AL FINAL */}
      </body>
    </html>
  );
}
```

> **Una vez hechos estos pasos en la base de código, corre `pnpm build && pnpm start` para verificar que la página sea ahora instalable.**
