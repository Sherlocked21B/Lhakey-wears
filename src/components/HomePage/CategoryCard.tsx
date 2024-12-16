import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type CategoryCardProps = {
  aspect?: string;
  width: number;
  height: number;
  alt: string;
  href: string;
  categoryName: string;
};
export default function CategoryCard({
  aspect,
  width,
  height,
  alt,
  href,
  categoryName,
}: CategoryCardProps) {
  return (
    <div
      className={cn(
        `w-full aspect-[1/1] relative group bg-slate-200`,
        aspect === "first" && "aspect-[3/3.5]",
        aspect === "second" && "aspect-[1/1.8]"
      )}
    >
      <Image
        src={"/feature3.png"}
        height={height}
        width={width}
        alt={alt}
        className={cn(
          `w-full aspect-[1/1] object-cover`,
          aspect === "first" && "aspect-[3/3.5]",
          aspect === "second" && "aspect-[1/1.8]"
        )}
      />
      <Link
        href={href}
        className="absolute top-0 left-0 w-full h-full bg-[#000000b0] flex items-center justify-center
            group-hover:opacity-100 opacity-0 transition-opacity duration-500"
      >
        <p className="text-white font-semibold text-lg">{categoryName}</p>
      </Link>
    </div>
  );
}
