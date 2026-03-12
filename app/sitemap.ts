import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/constants";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const supabase = await createClient();

  // Fetch all active business slugs
  const { data: businesses } = await supabase
    .from("businesses")
    .select("slug, updated_at")
    .order("updated_at", { ascending: false });

  const businessUrls: MetadataRoute.Sitemap = (businesses || []).map((b) => ({
    url: `${baseUrl}/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...businessUrls,
  ];
}
