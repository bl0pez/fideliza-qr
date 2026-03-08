import { getCategories } from "@/lib/data/api";
import { icons } from "lucide-react";

export async function CategoriesList() {
  const categories = await getCategories();

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-3 pt-1 px-1 -mx-1">
      {categories.map((category) => {
        // Obtenemos el ícono de la base de datos, o 'Tag' por defecto si no existe
        const IconComponent = (category.icon_name && icons[category.icon_name as keyof typeof icons]) 
          ? icons[category.icon_name as keyof typeof icons] 
          : icons.Tag;

        return (
          <button 
            key={category.id} 
            className="group flex flex-none items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 ease-out active:scale-95"
          >
            <div className="flex items-center justify-center bg-primary/10 text-primary rounded-xl p-1.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <IconComponent className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
