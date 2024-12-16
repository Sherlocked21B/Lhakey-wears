"use client";
import CheckoutCard from "@/components/Cards/CheckoutCard";
import CartModalCardLoading from "@/components/Loading/CartModalCartLoading";
import CartPageCardLoading from "@/components/Loading/CartPageCardLoading";
import { useGlobalContext } from "@/context";
import { CartType } from "@/lib/types";
import {
  cn,
  convertCartToOrderItem,
  generateSignature,
  getTotalPrice,
} from "@/lib/utils";
import { getAllCartItems } from "@/services/cart";
import { createNewOrder } from "@/services/order";
import { Tooltip, Button, Checkbox } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserCheckoutPage() {
  const { pageLevelLoader, setPageLevelLoader } = useGlobalContext();
  const [cartItems, setCartItems] = useState<CartType[] | []>([]);
  const [isInsideValley, setIsInsideValley] = useState(true);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [buttonLoader, setButtonLoader] = useState(false);
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  const orderItems = convertCartToOrderItem(cartItems);
  console.log(orderItems);

  const getCartItems = async () => {
    setPageLevelLoader(true);
    const res = await getAllCartItems(user?.id as string);

    if (res.success) {
      const selectedCartItems = res.data.filter(
        (item: CartType) => item.selected
      );
      setCartItems(selectedCartItems);
    }
    setPageLevelLoader(false);
  };
  const totalPayment =
    getTotalPrice(cartItems) - voucherDiscount + (isInsideValley ? 0 : 150);

  const handlePayment = async () => {
    setButtonLoader(true);
    // const formData = {
    //   amount: totalPayment,
    //   failure_url: "/user/profile",
    //   product_delivery_charge: 0,
    //   product_service_charge: 0,
    //   product_code: "EPAYTEST",
    //   signature: "YVweM7CgAtZW5tRKica/BIeYFvpSj09AaInsulqNKHk=",
    //   signed_field_names: "total_amount,transaction_uuid,product_code",
    //   success_url: "/user/orders",
    //   tax_amount: 0,
    //   total_amount: totalPayment,
    //   transaction_uuid: "ab14a8f2b02c3",
    // };
    console.log("User Phone number length: ", user?.phoneNumber?.length);

    if (
      user?.phoneNumber === undefined ||
      user?.phoneNumber === null ||
      user?.phoneNumber?.length === 0
    ) {
      toast.error("Please add your phone number in your profile");
      setButtonLoader(false);
      return;
    }
    if (
      user?.address === undefined ||
      user?.address === null ||
      user?.address?.length === 0
    ) {
      toast.error("Please add your address in your profile");
      setButtonLoader(false);
      return;
    }

    const formData = {
      user: user?.id,
      orderItems: orderItems,
      paymentMethod: paymentMethod,
      totalPrice: totalPayment,
      isPaid: false,
      currentProgress: "pending",
      deliveryFee: isInsideValley ? 0 : 150,
      voucherCode:
        JSON.parse(localStorage.getItem("voucher") as string)?.voucherCode ||
        "",
    };
    console.log(formData);

    const res = await createNewOrder(formData);
    if (res.success) {
      if (res.data) {
        console.log("Order Created: ", res);

        localStorage.setItem("orderId", JSON.stringify(res.orderId));
        redirectToEsewa(res.data);
      } else {
        toast.success(res.message);
        localStorage.removeItem("voucher");
        // router.push("/user/orders");
      }
    } else {
      toast.error(res.message);
    }
    setButtonLoader(false);
  };

  const redirectToEsewa = (formData: any) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    getCartItems();
    const discount = JSON.parse(
      localStorage.getItem("voucher") as string
    )?.voucherDiscount;
    if (discount) {
      setVoucherDiscount(parseInt(discount));
    }
  }, [user]);

  useEffect(() => {
    if (!isInsideValley) {
      setPaymentMethod("esewa");
    }
  }, [isInsideValley]);

  return (
    <div className="flex h-full divide-x-3">
      <div className="flex flex-col gap-4 w-3/4 h-full pb-16 divide-y-3">
        <div className="flex flex-col w-full pl-2 gap-1">
          <span className="flex">
            <p className="font-semibold w-24">Deliver to</p>
            <p className="capitalize">: {user?.name}</p>
          </span>
          <span className="flex">
            <p className="font-semibold w-24">Phone</p>
            <p className="capitalize">: {user?.phoneNumber}</p>
          </span>
          <span className="flex">
            <p className="font-semibold w-24">Email</p>
            <p className="">: {user?.email}</p>
          </span>
          <span className="flex">
            <p className="font-semibold w-24">Address</p>
            <p className="capitalize">: {user?.address}</p>
          </span>
          <Checkbox
            isSelected={isInsideValley}
            onValueChange={() => setIsInsideValley(!isInsideValley)}
          >
            Is the address inside Kathmandu Valley?
          </Checkbox>
        </div>
        <div className="pt-4 overflow-x-hidden overflow-y-auto pr-6">
          <div className="flex flex-col h-full divide-y-2">
            {pageLevelLoader ? (
              Array.from({ length: 3 }).map((_, i) => (
                <CartPageCardLoading key={i} index={i} />
              ))
            ) : cartItems.length > 0 ? (
              cartItems?.map((item) => (
                <CheckoutCard key={item._id} cartDetail={item} />
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
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <span className="w-full flex justify-between">
          <p className="font-semibold">Items Total</p>
          <p>{`Rs. ${getTotalPrice(cartItems)}`}</p>
        </span>
        <span className="w-full flex justify-between">
          <p className="font-semibold">Delivery Fee</p>
          <p>Rs. {isInsideValley ? 0 : 150}</p>
        </span>
        <span className="w-full flex justify-between">
          <p className="font-semibold">Voucher Discount</p>
          <p>-Rs. {voucherDiscount}</p>
        </span>
        <hr className="border-1 border-black" />

        <span className="flex justify-between">
          <p className="font-semibold">Total payment</p>
          <p>{`Rs. ${totalPayment}`}</p>
        </span>

        <hr className="border-1 border-black border-dotted" />
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Payment Method:</p>
          <div className="flex gap-4">
            <Tooltip content="eSewa">
              <span
                onClick={() => setPaymentMethod("esewa")}
                className={cn(
                  "cursor-pointer p-1 rounded-md",
                  paymentMethod === "esewa" && "shadow-lg bg-slate-200"
                )}
              >
                <Image
                  src={"/esewa-logo.png"}
                  width={40}
                  height={40}
                  alt={"esewa logo"}
                  className="w-10 h-10 aspect-square object-cover"
                />
              </span>
            </Tooltip>
            <Tooltip className="cursor-pointer" content="Cash on Delivery">
              <span
                onClick={() => {
                  if (isInsideValley) {
                    setPaymentMethod("cod");
                  }
                }}
                className={cn(
                  "cursor-pointer p-1 rounded-md",
                  paymentMethod === "cod" && "shadow-lg bg-slate-200"
                )}
              >
                <Image
                  src={"/cod-logo.png"}
                  width={40}
                  height={40}
                  className="w-10 h-10 aspect-square object-cover"
                  alt={"cash on delivery logo"}
                />
              </span>
            </Tooltip>
          </div>
        </div>

        <Button
          isLoading={buttonLoader}
          onClick={handlePayment}
          radius="sm"
          className="bg-black text-white w-full mt-4"
        >
          Place an Order
        </Button>
      </div>
    </div>
  );
}
