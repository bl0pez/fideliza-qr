import Link from "next/link";
import { getBusinesses } from "@/lib/data/api";
import BusinessCarousel from "./business-carousel";

export async function FeaturedBusinesses() {
  const businesses = await getBusinesses(4);

  return <BusinessCarousel businesses={businesses} />;
}
