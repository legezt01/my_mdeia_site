
'use client';

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const newsItems = [
  {
    headline: "Global Tech Summit 2024: Innovations that will Shape our Future",
    image: "https://placehold.co/1200x600.png",
    dataAiHint: "technology summit",
    category: "Technology"
  },
  {
    headline: "The Rise of Sustainable Living: How Communities are Going Green",
    image: "https://placehold.co/1200x600.png",
    dataAiHint: "sustainable living",
    category: "Environment"
  },
  {
    headline: "Space Exploration: Mars Rover Discovers Evidence of Ancient Lake",
    image: "https://placehold.co/1200x600.png",
    dataAiHint: "mars rover",
    category: "Science"
  },
  {
    headline: "AI in Healthcare: Revolutionizing Patient Care and Diagnostics",
    image: "https://placehold.co/1200x600.png",
    dataAiHint: "ai healthcare",
    category: "Health"
  },
];

export function TrendingNews() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="p-4 md:p-6">
        <h2 className="text-3xl font-bold mb-6">Trending News</h2>
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {newsItems.map((item, index) => (
              <CarouselItem key={index}>
                <Link href="#">
                  <Card className="overflow-hidden border-0 shadow-lg group rounded-xl">
                    <CardContent className="relative p-0 aspect-[16/9] md:aspect-[2.4/1]">
                      <Image
                        src={item.image}
                        alt={item.headline}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={item.dataAiHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 p-6 md:p-8 w-full">
                        <span className="text-sm font-body font-bold uppercase text-accent mb-2 inline-block bg-accent/20 px-2 py-1 rounded text-accent-foreground">{item.category}</span>
                        <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                          {item.headline}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
        </Carousel>
    </div>
  );
}
