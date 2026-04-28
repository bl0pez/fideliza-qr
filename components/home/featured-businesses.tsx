import { getBusinesses } from "@/lib/data/api";
import BusinessCarousel from "./business-carousel";

export async function FeaturedBusinesses() {
  const businesses = await getBusinesses({ limit: 10 });

  return <BusinessCarousel businesses={businesses} />;
}

