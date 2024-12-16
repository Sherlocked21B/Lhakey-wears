import ProductDetail from "@/components/ProductDetail";
import { getProductBySlug } from "@/services/product";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const res = await getProductBySlug(params.slug);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  if (res.success) {
    return {
      title: res.data[0].metaTitle,
      description: res.data[0].metaDescription,
      openGraph: {
        images: [res.data[0].imageUrl, ...previousImages],
      },
    };
  }
  return {
    title: "Product Not Found",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { [key: string]: string };
}) {
  const productDetail = await getProductBySlug(params.slug);

  return (
    <>
      {productDetail && productDetail.data && (
        <ProductDetail productDetail={productDetail.data[0]} />
      )}
    </>
  );
}
