import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CartType } from "@/lib/types";
import { deleteCart, singleSelectCart, updateCart } from "@/services/cart";
import { toast } from "react-toastify";
import { sizeMapping } from "@/lib/mapping";
import { ClipLoader } from "react-spinners";
import { cn, finalPrice } from "@/lib/utils";
import { Checkbox } from "@nextui-org/react";
import { HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { useSession } from "next-auth/react";

export default function CartCard({
  cartDetail,
  cartItems,
  setCartItems,
  setSelectLoader,
}: {
  cartDetail: CartType;
  cartItems: CartType[];
  setCartItems: React.Dispatch<React.SetStateAction<CartType[] | []>>;
  setSelectLoader: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [productCount, setProductCount] = useState(cartDetail.quantity);
  const [removeLoader, setRemoveLoader] = useState(false);
  const [disableDecrementButton, setDisableDecrementButton] = useState(false);
  const [disableIncrementButton, setDisableIncrementButton] = useState(false);
  const session = useSession();
  const user = session.data?.user;

  const handleDelete = async () => {
    setRemoveLoader(true);
    const res = await deleteCart(cartDetail._id);
    if (res.success) {
      setCartItems((prev) =>
        prev.filter((item) => item._id !== cartDetail._id)
      );
    } else {
      toast.error(res.message);
    }
    setRemoveLoader(false);
  };

  const handleSelect = async () => {
    setSelectLoader(true);
    const res = await singleSelectCart(user?.id as string, cartDetail._id);
    if (res.success) {
      setCartItems(res.data);
    } else {
      toast.error(res.message);
    }
    setSelectLoader(false);
  };
  const handleIncrement = async () => {
    setDisableDecrementButton(true);
    setDisableIncrementButton(true);
    const res = await updateCart(cartDetail, "increment");
    console.log(res);

    if (res.success) {
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === cartDetail._id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      setCartItems(updatedCartItems);
      setProductCount((prev) => prev + 1);
    } else {
      toast.error(res.message);
    }
    setDisableDecrementButton(false);
    setDisableIncrementButton(false);
  };

  const handleDecrement = async () => {
    setDisableDecrementButton(true);
    setDisableIncrementButton(true);
    const res = await updateCart(cartDetail, "decrement");
    console.log(res);
    if (res.success) {
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === cartDetail._id) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      setCartItems(updatedCartItems);
      setProductCount((prev) => prev - 1);
    } else {
      toast.error(res.message);
    }
    setDisableDecrementButton(false);
    setDisableIncrementButton(false);
  };

  useEffect(() => {
    if (productCount <= 1) {
      setProductCount(1);
      setDisableDecrementButton(true);
    }
  }, [productCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3 },
      }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="flex gap-4 items-center justify-between rounded-md p-2 py-6">
      <div className="flex gap-4 items-center">
        <Checkbox isSelected={cartDetail.selected} onClick={handleSelect} />
        <Image
          src={cartDetail.variant.imageGallery[0]}
          className="w-[100px] h-[100px] object-cover rounded-md shadow-md"
          width={100}
          height={100}
          alt={`${cartDetail.variant.color} ${cartDetail.productID.name} ${cartDetail.size}`}
        />

        <div className="flex flex-col justify-between gap-1 h-full">
          <p className="capitalize font-semibold line-clamp-1">
            {cartDetail.productID.name}
          </p>
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
          <p className="text-sm text-black font-semibold flex gap-2 items-center">
            Rs.{" "}
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
            onClick={handleDelete}
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
      </div>
      <div className="flex items-center gap-2 text-2xl">
        <button
          className={cn(
            "disabled:cursor-progress",
            productCount <= 1 && "disabled:cursor-not-allowed"
          )}
          disabled={disableDecrementButton}
          onClick={handleDecrement}>
          <HiMinusCircle />
        </button>
        <p className="text-lg">{productCount}</p>
        <button
          className="disabled:cursor-progress"
          disabled={disableIncrementButton}
          onClick={handleIncrement}>
          <HiPlusCircle />
        </button>
      </div>
    </motion.div>
  );
}
