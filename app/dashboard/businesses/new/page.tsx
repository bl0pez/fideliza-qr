import { createClient } from "@/utils/supabase/server";
import { BusinessForm } from "@/components/dashboard/business-form";

export default async function NewBusinessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all active categories from DB
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Negocio</h1>
        <p className="text-muted-foreground">Configura los detalles de tu nuevo local comercial.</p>
      </div>
      
      <BusinessForm categories={categories || []} />
    </div>
  );
}
