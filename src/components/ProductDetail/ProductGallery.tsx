"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  imageGallery,
  sizeImageUrl,
}: {
  imageGallery: string[];
  sizeImageUrl: string;
}) {
  const productGallery = sizeImageUrl
    ? [...imageGallery, sizeImageUrl]
    : [...imageGallery];

  const [imageIndex, setImageIndex] = useState(0);

  return (
    <>
      {productGallery && productGallery.length > 0 && (
        <section className="flex flex-col gap-4">
          <div>
            <Image
              radius="sm"
              as={NextImage}
              src={productGallery[imageIndex]}
              height={450}
              width={450}
              className="object-cover aspect-square w-[450px]"
              alt="lakhey-logo"
            />
          </div>
          <Carousel
            opts={{
              align: "center",
            }}
            className="w-full max-w-sm ml-8">
            <CarouselContent>
              {Array.from({ length: productGallery.length }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/4 cursor-pointer"
                  onClick={() => setImageIndex(index)}>
                  <div
                    className={cn(
                      "aspect-square rounded-sm border-2 border-background flex items-center justify-center w-[81px]",
                      index === imageIndex ? "border-black" : ""
                    )}>
                    <Image
                      // radius="sm"
                      as={NextImage}
                      src={productGallery[index]}
                      height={75}
                      width={75}
                      className="object-cover aspect-square w-[75px] h-auto rounded-sm m-0"
                      alt="lakhey-logo"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      )}
    </>
  );
}
