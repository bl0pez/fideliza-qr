"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Business } from "@/lib/data/api";
import { BusinessCard } from "@/components/ui/business-card";
import Autoplay from "embla-carousel-autoplay";

interface Props {
  businesses: Business[];
}

export default function BusinessCarousel({ businesses }: Props) {
  return (
    // overflow-hidden evita que el carousel se salga del container
    <div className="w-full overflow-hidden px-4">
      <Carousel
        opts={{ align: "center", loop: true }}
        className="w-full"
        plugins={[Autoplay({ delay: 2000, stopOnInteraction: true })]}
      >
        <CarouselContent className="-ml-3">
          {businesses.map((business) => (
            <CarouselItem
              key={business.id}
              // Mobile: 1 completa, sm: 2, md: 3, lg: 4
              className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <BusinessCard business={business} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}