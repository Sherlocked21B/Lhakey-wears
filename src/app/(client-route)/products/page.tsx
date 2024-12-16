import ProductCard from "@/components/ui/ProductCard";
import { ProductType } from "@/lib/types";
import { getAllProducts } from "@/services/product";
import React from "react";
export interface ProductProps {
  title: string;
  imageUrl: string;
  price: string;
  slug: string;
}

export default async function Products() {
  const productList = await getAllProducts();
  console.log(productList);
  return (
    <main className="my-container py-16">
      <section className="flex flex-wrap items-start justify-center md:justify-center gap-4 md:gap-8 lg:gap-10 xl:gap-12">
        {productList &&
          productList.data &&
          productList.data.map((product: ProductType) => (
            <ProductCard key={product._id} productDetail={product} />
          ))}
      </section>
    </main>
  );
}
