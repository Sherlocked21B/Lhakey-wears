import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CartType } from "@/lib/types";
import { deleteCart } from "@/services/cart";
import { toast } from "react-toastify";
import { sizeMapping } from "@/lib/mapping";
import { ClipLoader } from "react-spinners";
import { finalPrice } from "@/lib/utils";

export default function CartModalCard({
  cartDetail,
  setCartItems,
}: {
  cartDetail: CartType;
  setCartItems: React.Dispatch<React.SetStateAction<CartType[] | []>>;
}) {
  const [removeLoader, setRemoveLoader] = useState(false);
  const handleDelete = async (id: string) => {
    setRemoveLoader(true);
    const res = await deleteCart(cartDetail._id);
    if (res.success) {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
    } else {
      toast.error(res.message);
    }
    setRemoveLoader(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3 },
      }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="flex gap-4 items-center shadow-md rounded-md p-2">
      <Image
        src={cartDetail.variant.imageGallery[0]}
        className="w-[100px] h-[100px] object-cover rounded-md shadow-md"
        width={100}
        height={100}
        alt={`${cartDetail.variant.color} ${cartDetail.productID.name} ${cartDetail.size}`}
      />

      <div className="flex flex-col justify-between h-full">
        <p className="capitalize font-semibold line-clamp-1">
          {`${cartDetail.productID.name} ${cartDetail.variant.color} ${
            sizeMapping[
              cartDetail.size as
                | "small"
                | "medium"
                | "large"
                | "x-large"
                | "2x-large"
                | "3x-large"
            ]
          } `}
        </p>
        <p className="text-sm text-default-500">{cartDetail.quantity}</p>
        <p className="text-sm text-default-500 flex gap-2">
          {cartDetail.productID.onSale === "yes"
            ? finalPrice(
                cartDetail.productID.price as number,
                cartDetail.productID.discountPercentage as number
              )
            : cartDetail.productID.price}
          <span className="text-danger line-through text-xs">
            {cartDetail.productID.onSale === "yes" &&
              `${cartDetail.productID.price}`}
          </span>
        </p>
        <p
          onClick={() => handleDelete(cartDetail._id)}
          className="text-danger text-sm cursor-pointer flex gap-2">
          {removeLoader ? (
            <span>
              Loading <ClipLoader size={12} color="#F54280" />
            </span>
          ) : (
            "Remove"
          )}
        </p>
      </div>
    </motion.div>
  );
}
