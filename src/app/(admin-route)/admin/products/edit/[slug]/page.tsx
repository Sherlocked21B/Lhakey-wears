import CreateProduct from "@/components/Forms/CreateProduct";
import { getProductBySlug } from "@/services/product";
import React from "react";

export default async function ProductEdit({
  params,
}: {
  params: { [key: string]: string };
}) {
  const productDetail = await getProductBySlug(params.slug);
  const { reviews, qas, ...rest } = productDetail.data[0];

  return (
    <div className="lg:px-10 xl:px-16 pt-12 h-svh overflow-y-scroll">
      <h1 className="px-2.5 font-bold text-2xl mb-10">Edit Product</h1>
      {productDetail && productDetail.data && <CreateProduct editForm={rest} />}
    </div>
  );
}
