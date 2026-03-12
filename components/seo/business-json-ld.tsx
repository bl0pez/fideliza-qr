import { PublicBusiness } from "@/app/actions/public";
import { minutesToTime, parseRange } from "@/lib/utils/schedule-helpers";

interface BusinessJsonLdProps {
  business: PublicBusiness;
}

const DAY_MAP: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export function BusinessJsonLd({ business }: BusinessJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description || `Descubre las recompensas de ${business.name}`,
    "image": business.image_url,
    "url": `https://fidelilocal.com/${business.slug}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address || "",
      "addressLocality": business.city,
      "addressCountry": "CL" // Standardizing for the platform for now
    },
    "sameAs": [
      business.instagram_url,
      business.tiktok_url,
      business.website_url
    ].filter(Boolean),
    "openingHoursSpecification": (business.business_schedules || []).map(s => {
      const { start, end } = parseRange(s.hour_range);
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": DAY_MAP[s.day_of_week],
        "opens": minutesToTime(start),
        "closes": minutesToTime(end)
      };
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
