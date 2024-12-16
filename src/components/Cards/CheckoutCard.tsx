import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CartType } from "@/lib/types";
import { sizeMapping } from "@/lib/mapping";
import { cn, finalPrice } from "@/lib/utils";

export default function CheckoutCard({ cartDetail }: { cartDetail: CartType }) {
  const lastPrice =
    cartDetail.productID.onSale === "yes"
      ? finalPrice(
          cartDetail.productID.price as number,
          cartDetail.productID.discountPercentage as number
        )
      : cartDetail.productID.price;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3 },
      }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="flex gap-4 items-center justify-between rounded-md p-2 py-6"
    >
      <div className="flex justify-between w-full">
        <div className="flex gap-4">
          <Image
            src={cartDetail.variant.imageGallery[0]}
            className="w-[100px] h-[100px] object-cover rounded-md shadow-md"
            width={100}
            height={100}
            alt={`${cartDetail.variant.color} ${cartDetail.productID.name} ${cartDetail.size}`}
          />
          <div className="flex flex-col gap-2 h-full">
            <p className="capitalize font-semibold line-clamp-1">
              {cartDetail.productID.name}
            </p>
            <div className="flex gap-4">
              <p className="text-sm capitalize">
                Color: {cartDetail.variant.color}
              </p>
              <p className="text-sm">
                Size:{" "}
                {
                  sizeMapping[
                    cartDetail.size as
                      | "small"
                      | "medium"
                      | "large"
                      | "x-large"
                      | "2x-large"
                      | "3x-large"
                  ]
                }
              </p>
            </div>
            <p className="text-sm text-black font-semibold flex gap-2 items-center">
              Rs. {lastPrice}
              <span className="text-danger line-through text-xs">
                {cartDetail.productID.onSale === "yes" &&
                  `${cartDetail.productID.price}`}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="font-semibold">Quantity</p>
          <p>{cartDetail.quantity}</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p className="font-semibold">Total</p>
          <p>Rs. {cartDetail.quantity * lastPrice}</p>
        </div>
      </div>
    </motion.div>
  );
}
