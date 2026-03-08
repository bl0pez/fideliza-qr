"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import * as Icons from "lucide-react";
import { Category } from "@/lib/data/api";

interface Props {
  categories: Category[];
}

export function ExploreCategories({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    // Usamos scroll: false para que no salte al tope de la página
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-3 pb-3 pt-1 px-1">
        <button
          onClick={() => handleCategory("all")}
          className={`group flex flex-none items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 ease-out active:scale-95 shadow-sm ${
            currentCategory === "all"
              ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
              : "bg-card border-border hover:border-primary/40 text-foreground"
          }`}
        >
          <Icons.LayoutGrid className={`w-4 h-4 ${currentCategory === "all" ? "text-primary-foreground" : "text-primary"}`} />
          <span className="text-sm font-semibold">Todos</span>
        </button>

        {categories.map((cat) => {
          const iconKey = cat.icon_name as keyof typeof Icons;
          const IconComponent = (cat.icon_name && Icons[iconKey]) 
            ? Icons[iconKey] as React.ElementType
            : Icons.Tag;

          const isActive = currentCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className={`group flex flex-none items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 ease-out active:scale-95 shadow-sm ${
                isActive
                  ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                  : "bg-card border-border hover:border-primary/40 text-foreground"
              }`}
            >
              <div className={`flex items-center justify-center rounded-xl p-1 transition-colors duration-300 ${
                isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
              }`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className={`text-sm font-semibold transition-colors duration-300 ${
                isActive ? "text-white" : "group-hover:text-primary"
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
}
