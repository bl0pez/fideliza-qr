import { BusinessForm } from "@/components/dashboard/business-form";
import { getCategories } from "@/app/actions/categories";
import { getCities } from "@/app/actions/cities";
import { getCountries } from "@/app/actions/countries";

export default async function NewBusinessPage() {
  // Fetch data via Server Actions
  const [categories, cities, countries] = await Promise.all([
    getCategories(),
    getCities(),
    getCountries()
  ]);

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Negocio</h1>
        <p className="text-muted-foreground">Configura los detalles de tu nuevo local comercial.</p>
      </div>
      
      <BusinessForm 
        categories={categories || []} 
        cities={cities || []} 
        countries={countries || []}
      />
    </div>
  );
}
