import ProductCard from "@/components/ui/ProductCard";
import { ProductType } from "@/lib/types";
import { getProductByCategory } from "@/services/product";
import React from "react";

export default async function ProductDetailPage({
  params,
}: {
  params: { [key: string]: string };
}) {
  const productsByCategory = await getProductByCategory(params.category);
  return (
    <main className="my-container">
      <section className="flex flex-wrap items-start justify-center md:justify-center gap-4 md:gap-8 lg:gap-10 xl:gap-12">
        {productsByCategory &&
          productsByCategory.data &&
          productsByCategory.data.map((product: ProductType) => (
            <ProductCard key={product._id} productDetail={product} />
          ))}
      </section>
    </main>
  );
}
