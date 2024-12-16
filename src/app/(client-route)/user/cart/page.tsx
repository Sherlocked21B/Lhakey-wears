"use client";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@nextui-org/checkbox";
import { IoTrashOutline } from "react-icons/io5";
import { useGlobalContext } from "@/context";
import { deleteCart, getAllCartItems, selectCart } from "@/services/cart";
import CartCard from "@/components/Cards/CartCard";
import { CartType } from "@/lib/types";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import CartPageCardLoading from "@/components/Loading/CartPageCardLoading";
import {
  cn,
  getDiscountPriceForCategory,
  getLengthOfSelectedCartItems,
  getTotalPrice,
  getTotalPriceWithoutDiscount,
  getTotalQuantity,
} from "@/lib/utils";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { searchVoucher } from "@/services/voucher";
import {
  now,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  ZonedDateTime,
  fromDate,
} from "@internationalized/date";
import { useSession } from "next-auth/react";

export default function UserCartPage() {
  const { pageLevelLoader, setPageLevelLoader } = useGlobalContext();
  const [cartItems, setCartItems] = useState<CartType[] | []>([]);
  const [selectLoader, setSelectLoader] = useState(false);
  const [deleteButtonLoader, setDeleteButtonLoader] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherRedeemLoading, setVoucherRedeemLoading] = useState(false);
  const session = useSession();
  const user = session.data?.user;

  const getCartItems = async () => {
    setPageLevelLoader(true);
    const res = await getAllCartItems(user?.id as string);

    if (res.success) {
      setCartItems(res.data);
    }
    setPageLevelLoader(false);
  };

  const handleSelect = async () => {
    setSelectLoader(true);
    const action = areAllSelected() ? "deselectAll" : "selectAll";
    const res = await selectCart(user?.id as string, action);
    if (res.success) {
      setCartItems(res.data);
    } else {
      toast.error(res.message);
    }
    setSelectLoader(false);
  };

  const handleRedeemVoucher = async () => {
    setVoucherRedeemLoading(true);

    const res = await searchVoucher(voucherCode);
    setVoucherRedeemLoading(false);
    if (res.success) {
      const currentDate = now(getLocalTimeZone());

      if (
        fromDate(new Date(res.data.start), getLocalTimeZone()).compare(
          currentDate
        ) >= 0
      ) {
        toast.error("Voucher is not active yet!!!");
      } else {
        if (
          !(
            fromDate(new Date(res.data.expiry), getLocalTimeZone()).compare(
              currentDate
            ) >= 0
          )
        ) {
          toast.error("Voucher is expired!!!");
        } else {
          if (res.minimumAmount > getTotalPrice(cartItems)) {
            toast.error("Minimum total price must be Rs. " + res.minimumAmount);
          } else {
            let discount = 0;
            if (res.data.category === "all") {
              discount =
                (res.data.discount * getTotalPriceWithoutDiscount(cartItems)) /
                100;
              console.log(discount);
            } else {
              discount = getDiscountPriceForCategory(
                cartItems,
                res.data.category,
                res.data.discount
              );
            }
            discount = Math.floor(discount);
            if (res.data.maximumDiscount === 0) {
              setVoucherDiscount(discount);
              localStorage.setItem(
                "voucher",
                JSON.stringify({
                  voucherDiscount: discount,
                  voucherCode: voucherCode,
                })
              );
            } else if (discount < res.data.maximumDiscount) {
              setVoucherDiscount(discount);
              localStorage.setItem(
                "voucher",
                JSON.stringify({
                  voucherDiscount: discount,
                  voucherCode: voucherCode,
                })
              );
            } else {
              setVoucherDiscount(res.data.maximumDiscount);
              localStorage.setItem(
                "voucher",
                JSON.stringify({
                  voucherDiscount: res.data.maximumDiscount,
                  voucherCode: voucherCode,
                })
              );
            }
            toast.success("Voucher Applied Successfully!!!");
          }
        }
      }
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    if (user) {
      setVoucherCode(
        JSON.parse(localStorage.getItem("voucher") as string)?.voucherCode || ""
      );
      getCartItems();
    }
  }, [user]);

  useEffect(() => {
    if (voucherCode !== "") {
      handleRedeemVoucher();
    }
  }, [getTotalPrice(cartItems)]);

  async function deleteSelectedCartItems() {
    setDeleteButtonLoader(true);
    const res = await deleteCart(user?.id as string);
    if (res.success) {
      toast.success(res.message);
      getCartItems();
    } else {
      toast.error(res.message);
    }
    setDeleteButtonLoader(false);
  }

  function areAllSelected() {
    return cartItems.every((item) => item.selected === true);
  }
  return (
    <div className="flex h-full divide-x-3">
      <div className="flex flex-col gap-4 w-3/4 h-full pr-4 pb-16">
        <h2 className="text-xl font-semibold pl-2">Shopping Cart</h2>
        <div className="flex justify-between w-full pl-2">
          <Checkbox isSelected={areAllSelected()} onClick={handleSelect}>
            Select All{" "}
            <span>{`(${getTotalQuantity(cartItems)} Items Selected)`}</span>
          </Checkbox>
          <Button
            disabled={getLengthOfSelectedCartItems(cartItems) === 0}
            isLoading={deleteButtonLoader}
            variant="ghost"
            onClick={deleteSelectedCartItems}
            color="danger"
            className="flex gap-2 items-center cursor-pointer disabled:cursor-not-allowed">
            <span>Delete</span>
            <IoTrashOutline className="text-lg" />
          </Button>
        </div>
        <div className="relative overflow-x-hidden overflow-y-auto">
          {selectLoader && (
            <div className="absolute top-0 left-0 w-full h-full z-20 flex items-center justify-center">
              <ClipLoader size={50} color="#000" />
            </div>
          )}

          <div
            className={cn(
              "flex flex-col h-full divide-y-2",
              selectLoader && "opacity-50"
            )}>
            {pageLevelLoader ? (
              Array.from({ length: 3 }).map((_, i) => (
                <CartPageCardLoading key={i} index={i} />
              ))
            ) : cartItems.length > 0 ? (
              cartItems?.map((item) => (
                <CartCard
                  key={item._id}
                  cartDetail={item}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  setSelectLoader={setSelectLoader}
                />
              ))
            ) : (
              <div className="text-xl font-bold text-danger mt-16">
                No Items Found In The Cart!!!
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-4 pl-6">
        <h3 className="text-lg font-semibold">Cart Summary</h3>
        <span className="w-full flex justify-between">
          <p>{`Subtotal (${getTotalQuantity(cartItems)} items)`}</p>{" "}
          <p>{`Rs. ${getTotalPrice(cartItems)}`}</p>
        </span>
        <div className="flex justify-between gap-4">
          <input
            className="border-3 border-slate-500 w-full px-4 py-1 rounded-md focus:border-black focus:border-3"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Enter Voucher Code"
            type="text"
          />
          <Button
            isLoading={voucherRedeemLoading}
            onClick={handleRedeemVoucher}
            radius="sm"
            className="bg-black text-white">
            APPLY
          </Button>
        </div>
        <span className="flex justify-between">
          <p className="">Voucher Discount</p>
          <p>{`-Rs. ${voucherDiscount}`}</p>
        </span>
        <hr className="border-1 border-black" />
        <span className="flex justify-between">
          <p className="">Total</p>
          <p>{`Rs. ${getTotalPrice(cartItems) - voucherDiscount}`}</p>
        </span>
        <Link href={"/user/checkout"} className=" mx-auto mt-4 w-full pl-2">
          <Button radius="sm" className="bg-black text-white w-full">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
