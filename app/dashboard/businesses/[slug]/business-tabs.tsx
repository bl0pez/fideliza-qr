"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function BusinessTabs({ slug }: { slug: string }) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Tarjetas Activas",
      href: `/dashboard/businesses/${slug}`,
      active: pathname === `/dashboard/businesses/${slug}`,
    },
    {
      label: "Directorio de Clientes",
      href: `/dashboard/businesses/${slug}/customers`,
      active: pathname === `/dashboard/businesses/${slug}/customers`,
    },
  ];

  return (
    <div className="flex gap-4 border-b border-border pb-px overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-4 py-2 border-b-2 transition-all whitespace-nowrap text-sm font-medium",
            tab.active
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
