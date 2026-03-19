import { getCategories } from "@/app/actions/categories";
import { getCities } from "@/app/actions/cities";
import { getCountries } from "@/app/actions/countries";
import { getOwnerProfiles } from "@/app/actions/auth";
import { AdminShopForm } from "@/components/admin/admin-shop-form";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function AdminFormSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-12 w-96 rounded-2xl" />
        <Skeleton className="h-4 w-72 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-64 md:col-span-2 rounded-[2.5rem]" />
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-32 md:col-span-2 rounded-2xl" />
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-12 md:col-span-2 rounded-2xl" />
      </div>
    </div>
  );
}

async function AdminShopFormContent() {
  const [categories, cities, countries, profiles] = await Promise.all([
    getCategories(),
    getCities(),
    getCountries(),
    getOwnerProfiles()
  ]);

  return (
    <AdminShopForm 
      categories={categories || []} 
      cities={cities || []} 
      countries={countries || []} 
      profiles={profiles || []}
    />
  );
}

export default function NewAdminShopPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Suspense fallback={<AdminFormSkeleton />}>
        <AdminShopFormContent />
      </Suspense>
    </div>
  );
}
