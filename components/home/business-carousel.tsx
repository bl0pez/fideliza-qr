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
    <div className="w-full relative px-4 md:px-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          containScroll: "trimSnaps",
        }}
        className="w-full max-w-7xl mx-auto"
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent className="-ml-6 md:-ml-8">
          {businesses.map((business) => (
            <CarouselItem
              key={business.id}
              className="pl-6 md:pl-8 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="pb-12">
                {" "}
                {/* Spacing for card shadows */}
                <BusinessCard business={business} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
