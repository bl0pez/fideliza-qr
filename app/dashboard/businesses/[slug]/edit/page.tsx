import { BusinessForm } from "@/components/dashboard/business-form";
import { APP_NAME } from "@/lib/constants";
import { getBusinessBySlug } from "@/app/actions/business";
import { getCategories } from "@/app/actions/categories";
import { getCities } from "@/app/actions/cities";
import { getCountries } from "@/app/actions/countries";
import { notFound } from "next/navigation";

export const metadata = {
  title: `Editar Negocio | ${APP_NAME}`,
};

export default async function EditBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Parallel fetch (Server Actions)
  const [business, categories, cities, countries] = await Promise.all([
    getBusinessBySlug(slug),
    getCategories(),
    getCities(),
    getCountries()
  ]);

  if (!business) {
    notFound();
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
        <p className="text-muted-foreground">Actualiza la información de tu negocio {business.name}.</p>
      </div>
      
      <BusinessForm 
        categories={categories || []} 
        cities={cities || []}
        countries={countries || []}
        initialData={{
          id: business.id,
          name: business.name,
          type: business.type,
          image_url: business.image_url,
          country_id: business.country_id || "",
          city: business.city,
          city_id: business.city_id,
          address: business.address,
          tiktok_url: business.tiktok_url,
          whatsapp_url: business.whatsapp_url,
          instagram_url: business.instagram_url,
        }} 
      />
    </div>
  );
}
