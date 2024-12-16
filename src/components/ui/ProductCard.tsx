"use client";
import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { finalPrice } from "@/lib/utils";
import { ProductType } from "@/lib/types";

export default function ProductCard({
  productDetail,
}: {
  productDetail: ProductType;
}) {
  const router = useRouter();
  return (
    <Card
      shadow="sm"
      className="group rounded-md w-4/5 md:w-2/5 lg:w-1/4 hover:shadow-xl"
      isPressable
      onPress={() =>
        router.push(`/products/${productDetail.category}/${productDetail.slug}`)
      }>
      <CardBody className="overflow-hidden p-0">
        <Image
          priority
          radius="none"
          as={NextImage}
          shadow="sm"
          width={500}
          height={300}
          alt={productDetail.name}
          className="object-cover w-full aspect-[4/3] group-hover:scale-110"
          src={productDetail.imageUrl}
        />
      </CardBody>
      <CardFooter className="flex flex-col gap-2 items-start text-start">
        <b className="line-clamp-1">{productDetail.name}</b>
        <div className="flex flex-col w-1/2 text-default-500 h-[48px]">
          <p className="text-black">
            Rs.&nbsp;
            {productDetail.onSale === "yes"
              ? finalPrice(
                  productDetail.price as number,
                  productDetail.discountPercentage as number
                )
              : productDetail.price}
          </p>
          {productDetail.onSale === "yes" && (
            <p className="flex gap-4 text-sm">
              <span className="line-through text-brand">
                {productDetail.price}
              </span>
              {productDetail.discountPercentage}%
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
