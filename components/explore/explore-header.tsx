"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/data/api";

interface Props {
  categories: Category[];
}

export function ExploreHeader({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/explore?${params.toString()}`);
  };

  const handleCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar negocios, comida, servicios..."
          className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <Badge
          variant={currentCategory === "all" ? "default" : "secondary"}
          className="cursor-pointer px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium"
          onClick={() => handleCategory("all")}
        >
          Todos
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat.id}
            variant={currentCategory === cat.id ? "default" : "secondary"}
            className="cursor-pointer px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium"
            onClick={() => handleCategory(cat.id)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
