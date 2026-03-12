import { PublicBusiness } from "@/app/actions/public";

interface BusinessJsonLdProps {
  business: PublicBusiness;
}

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
    ].filter(Boolean)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
