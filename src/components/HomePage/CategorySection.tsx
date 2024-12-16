import Image from "next/image";
import Link from "next/link";
import React from "react";
import CategoryCard from "./CategoryCard";
import { poppinsMedium } from "@/app/layout";

export default function CategorySection() {
  return (
    <div className="w-full">
      <h2
        className={`text-brand text-4xl font-black mb-20 ${poppinsMedium.className}`}
      >
        STYLE AND FASHION CATEGORY
      </h2>
      <div className="flex justify-between items-center">
        <div className="w-[17%]">
          <CategoryCard
            aspect={"first"}
            width={212}
            height={247.333}
            alt="tshirt category"
            href={"/products/jackets"}
            categoryName={"Jackets"}
          />
        </div>
        <div className="w-[17%] flex flex-col gap-4">
          <CategoryCard
            width={212}
            height={212}
            alt="hoodies category"
            href={"/products/hoodies"}
            categoryName={"Hoodies"}
          />
          <CategoryCard
            width={212}
            height={212}
            alt="shorts category"
            href={"/products/shorts"}
            categoryName={"Shorts"}
          />
        </div>
        <div className="w-[23%]">
          <CategoryCard
            aspect={"second"}
            width={287}
            height={516}
            alt="all products category"
            href={"/products"}
            categoryName={"All Products"}
          />
        </div>
        <div className="w-[17%] flex flex-col gap-4">
          <CategoryCard
            width={212}
            height={212}
            alt="tshirt category"
            href={"/products/tshirts"}
            categoryName={"T-Shirts"}
          />
          <CategoryCard
            width={212}
            height={212}
            alt="mask category"
            href={"/products/masks"}
            categoryName={"Masks"}
          />
        </div>
        <div className="w-[17%]">
          <CategoryCard
            aspect={"first"}
            width={212}
            height={247.333}
            alt="jogger category"
            href={"/products/joggers"}
            categoryName={"Joggers"}
          />
        </div>
      </div>
    </div>
  );
}
