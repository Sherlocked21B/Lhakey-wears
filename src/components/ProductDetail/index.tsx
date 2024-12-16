"use client";

import { ProductType } from "@/lib/types";
import React, { useState } from "react";
import Breadcrumb from "./Breadcrumb";
import ProductGallery from "./ProductGallery";
import { apiUrl, cn, finalPrice, getSizeIndex } from "@/lib/utils";
import Rating from "@mui/material/Rating";
import { sizeMapping } from "@/lib/mapping";
import Image from "next/image";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { MdRemove, MdAdd } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import updateCurrencyRates from "@/services/currency/updateCurrencyRates";
import { addToCart } from "@/services/cart";
import { toast } from "react-toastify";
import CartModal from "./CartModal";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReviewsAndDescriptions from "./ReviewsAndDescriptions";

export default function ProductDetail({
  productDetail,
}: {
  productDetail: ProductType;
}) {
  console.log("Product Detail: ", productDetail);

  const [variant, setVariant] = useState(
    productDetail.variants && productDetail.variants[0]
  );
  const [currentSize, setCurrentSize] = useState(variant?.sizes[0].name);
  const [quantity, setQuantity] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [cartButtonLoader, setCartButtonLoader] = useState(false);
  const [addButtonLoader, setAddButtonLoader] = useState(false);
  const session = useSession();
  const user = session.data?.user;
  const pathName = usePathname();

  console.log(getSizeIndex(currentSize, variant));

  const isQuantityMoreThanStock =
    quantity > variant.sizes[getSizeIndex(currentSize, variant)].stock;

  function handleBuyNow() {
    if (!user || !user.id) {
      router.push("/signin");
    } else {
      const cartDetail = {
        userID: user.id,
        productID: productDetail,
        variant: variant,
        quantity: quantity,
        size: currentSize,
        selected: true,
      };
      localStorage.setItem("cartDetail", JSON.stringify(cartDetail));
      router.push(`${pathName}/buy-now`);
    }
  }

  async function handleAddToCart() {
    if (!user || !user.id) {
      router.push("/signin");
    } else {
      setCartButtonLoader(true);
      const cartDetail = {
        userID: user.id,
        productID: productDetail._id as string,
        variant: variant,
        quantity: quantity,
        size: currentSize,
        selected: true,
      };

      const res = await addToCart(cartDetail);

      if (res.success) {
        toast.success(res.message);
        onOpen();
      } else {
        toast.error(res.message);
      }
      setCartButtonLoader(false);
    }
  }

  return (
    <>
      <div className="py-10 my-container">
        <Breadcrumb
          category={productDetail.category as string}
          name={productDetail.name}
        />
        <div className="flex">
          <div className="w-1/2">
            <ProductGallery
              imageGallery={variant?.imageGallery as string[]}
              sizeImageUrl={productDetail.sizeImageUrl as string}
            />
          </div>
          <div className="w-1/2 divide-y-2">
            <div className="flex flex-col gap-2 py-4">
              <h2 className="capitalize font-extrabold text-3xl ">
                {productDetail.name}
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 items-center">
                  <p className="text-black text-lg font-semibold">
                    Rs.&nbsp;
                    {productDetail.onSale === "yes"
                      ? finalPrice(
                          productDetail.price as number,
                          productDetail.discountPercentage as number
                        )
                      : productDetail.price}
                  </p>
                  {productDetail.onSale === "yes" && (
                    <p className="flex gap-4 text-sm line-through text-brand">
                      {productDetail.price}
                    </p>
                  )}
                </div>
                {productDetail.onSale === "yes" && (
                  <div className="flex gap-4 items-center">
                    <p className="text-sm text-brand border-2 border-brand px-4 py-1 rounded-full w-fit">
                      {productDetail.discountPercentage}% Off
                    </p>
                    <p className="text-default-500">
                      {productDetail.discountLabel}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Rating name="product rating" value={5} readOnly />
                <p>{`${5} (${36})`}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <span className="flex gap-2 items-center">
                  <h3 className="text-lg font-semibold">Color: </h3>
                  <p className="capitalize">{variant?.color}</p>
                </span>
                <div className="flex gap-2">
                  {productDetail.variants?.map((item) => (
                    <div
                      key={`${item?.color}-${item.id}`}
                      onClick={() => setVariant(item)}
                      className={cn(
                        "p-0.5 border-2 border-background rounded-sm",
                        item.color === variant?.color && "border-black"
                      )}>
                      <Image
                        className="aspect-square h-[80px] w-auto object-cover rounded-sm"
                        src={item?.imageGallery[0]}
                        width={80}
                        height={80}
                        alt={`${item?.color}-variant`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <h3 className="text-lg font-semibold">Sizes:</h3>
                <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                    {variant?.sizes?.map((size) => (
                      <button
                        onClick={() => {
                          setCurrentSize(size.name);
                        }}
                        key={size.name}
                        className={cn(
                          "w-8 h-8 text-sm border-2 border-slate-200 rounded-sm",
                          currentSize === size.name
                            ? size.stock < quantity
                              ? "border-red-700 text-red-700"
                              : "bg-black text-white border-black"
                            : ""
                        )}>
                        {
                          sizeMapping[
                            size.name as
                              | "small"
                              | "medium"
                              | "large"
                              | "x-large"
                              | "2x-large"
                              | "3x-large"
                          ]
                        }
                      </button>
                    ))}{" "}
                  </div>
                  <p
                    className={cn(
                      "text-default-500 justify-end",
                      isQuantityMoreThanStock && "text-red-700"
                    )}>
                    Stock:{" "}
                    {variant.sizes[getSizeIndex(currentSize, variant)].stock}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-16 py-4">
              <div className="flex gap-2">
                <h3 className="text-lg font-semibold">Quantity:</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setQuantity(quantity - 1)}
                    className="rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
                    disabled={quantity <= 1}
                    isIconOnly
                    size="sm">
                    <MdRemove className="text-xl" />
                  </Button>
                  <p className="flex items-center justify-center w-20 h-8 border-2 border-default-400 rounded-full">
                    {quantity}
                  </p>
                  <Button
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-full"
                    isIconOnly
                    size="sm">
                    <MdAdd className="text-xl" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                {/* <button className="relative border-2 border-black text-black px-4 py-0 rounded-full group flex items-center overflow-hidden hover:text-white transition-colors duration-1000">
                  <span className="-translate-x-36 absolute bg-black min-w-[120px] h-full rounded-full group-hover:-translate-x-4  transition-transform duration-700"></span>
                  <span className="z-50">Hover Me</span>
                </button> */}
                <Button
                  onClick={handleBuyNow}
                  disabled={isQuantityMoreThanStock}
                  radius="full"
                  variant="bordered"
                  className="disabled:cursor-not-allowed w-[48%] font-semibold text-brand border-brand hover:bg-brand hover:text-background">
                  Buy Now
                </Button>

                <Button
                  disabled={isQuantityMoreThanStock}
                  onClick={handleAddToCart}
                  isLoading={cartButtonLoader}
                  radius="full"
                  className="disabled:cursor-not-allowed w-[48%] bg-default-700 text-background font-semibold hover:bg-black">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ReviewsAndDescriptions
          reviews={productDetail.reviews}
          description={productDetail.description}
          qas={productDetail.qas}
          productId={productDetail._id as string}
        />
      </div>
      <CartModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
