import { getCategories } from "@/lib/data/api";
import * as Icons from "lucide-react";
import Link from "next/link";

export async function CategoriesList() {
  const categories = await getCategories();

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-4">
      {categories.map((category) => {
        const iconKey = category.icon_name as keyof typeof Icons;
        const IconComponent = (category.icon_name && Icons[iconKey]) 
          ? Icons[iconKey] as React.ElementType
          : Icons.Tag;

        return (
          <Link
            key={category.id}
            href={`/explore?category=${category.id}`}
            className="group flex flex-col items-center gap-3 transition-all duration-300 ease-out active:scale-95"
          >
            <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs group-hover:shadow-md group-hover:border-primary/30 group-hover:bg-white transition-all duration-300">
              {/* Decorative background circle on hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-2xl transition-colors duration-300" />
              
              <IconComponent className="w-6 h-6 md:w-7 h-7 text-slate-600 group-hover:text-primary transition-colors duration-300 relative z-10" />
            </div>
            <span className="text-xs md:text-sm font-bold text-slate-500 group-hover:text-primary transition-colors duration-300 tracking-tight text-center max-w-[80px] md:max-w-none">
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
