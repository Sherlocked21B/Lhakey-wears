"use client";

import { sizeMapping } from "@/lib/mapping";
import { OrderDetailType } from "@/lib/types";
import { finalPrice } from "@/lib/utils";
import { updateProgressStatus } from "@/services/order";
import { DateFormatter } from "@internationalized/date";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import OrderProgress from "./OrderProgress";

export default function OrderDetail({
  orderDetail,
}: {
  orderDetail: OrderDetailType;
}) {
  console.log(orderDetail);
  const [cancelButtonLoader, setCancelButtonLoader] = useState(false);
  const router = useRouter();

  const session = useSession();
  const user = session.data?.user;
  const orderCreationDate = new Date(orderDetail.createdAt);
  const orderUpdatedDate = new Date(orderDetail.updatedAt);
  const formatterLong = new DateFormatter("en-US", {
    dateStyle: "long",
    timeStyle: "long",
  });
  const orderCreatedAt = formatterLong.format(orderCreationDate);
  const orderUpdatedAt = formatterLong.format(orderUpdatedDate);

  async function handleCancelOrder() {
    setCancelButtonLoader(true);
    const res = await updateProgressStatus(
      "cancelled",
      user?.id as string,
      orderDetail._id as string
    );
    if (res.success) {
      toast.success("Order cancelled successfully");
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setCancelButtonLoader(false);
  }
  return (
    <div className="h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold">Order #{orderDetail._id}</h2>
        <p>{orderCreatedAt}</p>
      </div>
      <div className="flex flex-grow h-1 divide-x-3">
        <div className="flex flex-col w-[65%] h-full pb-10">
          <div className="py-6">
            {orderDetail.currentProgress === "cancelled" ? (
              <p className="text-danger text-semibold text-lg">
                This Order was cancelled in {orderUpdatedAt}
              </p>
            ) : (
              <OrderProgress
                currentProgress={orderDetail.currentProgress}
                orderUpdatedAt={orderUpdatedAt}
              />
            )}
          </div>
          <div className="flex flex-col h-1 flex-grow overflow-auto divide-y-3 pr-4">
            {orderDetail.orderItems.map((item) => (
              <div
                key={`${item.productName} ${item.size} ${item.color}`}
                className="py-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
              >
                <div className=" w-full md:w-40">
                  <Image
                    height={100}
                    width={100}
                    alt={`${item.productName} ${item.size} ${item.color}`}
                    src={item && item.image}
                    className="w-full hidden md:block aspect-square object-cover rounded-md shadow-md"
                  />
                </div>
                <div className="md:flex-row flex-col flex items-start w-full">
                  <div className="w-full flex flex-col justify-start items-start">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                      {item.productName}
                    </h3>
                    <p className="capitalize">Color: {item.color}</p>
                    <p>
                      Size: {sizeMapping[item.size as keyof typeof sizeMapping]}
                    </p>
                  </div>
                  <div className="w-full flex justify-between items-start space-x-8">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                      {item.quantity}
                    </h3>
                    <div className="flex gap-4">
                      {item.discountPercentage &&
                        item.discountPercentage > 0 && (
                          <h3 className="line-through text-xl font-semibold leading-6 text-danger">
                            Rs. {item.price}
                          </h3>
                        )}
                      <h3 className="text-xl font-semibold leading-6 text-gray-900">
                        Rs.{" "}
                        {finalPrice(
                          item.price,
                          item.discountPercentage as number
                        )}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[35%] pl-4 h-full divide-y-3">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-semibold leading-6 mb-2.5">
              Customer Details
            </h2>
            <span className="flex">
              <p className="font-semibold w-20">Name</p>
              <p className="capitalize">: {user?.name}</p>
            </span>
            <span className="flex">
              <p className="font-semibold w-20">Phone</p>
              <p className="capitalize">: {user?.phoneNumber}</p>
            </span>
            <span className="flex">
              <p className="font-semibold w-20">Email</p>
              <p className="">: {user?.email}</p>
            </span>
            <span className="flex">
              <p className="font-semibold min-w-20">Address</p>
              <p className="capitalize">: {user?.address}</p>
            </span>
          </div>
          <div className="flex justify-center flex-col w-full mt-6 pt-6">
            <h3 className="text-xl font-semibold leading-6 mb-4">Summary</h3>
            <div className="flex justify-center items-center w-full flex-col gap-2">
              <div className="flex justify-between w-full">
                <p className="text-base leading-5 font-semibold">Subtotal</p>
                <p className="text-base leading-5 text-gray-900">
                  Rs.{" "}
                  {orderDetail && orderDetail.deliveryFee
                    ? orderDetail.totalPrice -
                      orderDetail.deliveryFee +
                      orderDetail.voucherDiscount
                    : orderDetail.totalPrice + orderDetail.voucherDiscount}
                </p>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-base leading-5 font-semibold">Shipping</p>
                <p className="text-base leading-5 text-gray-900">
                  Rs.{" "}
                  {orderDetail && orderDetail.deliveryFee
                    ? orderDetail.deliveryFee
                    : 0}
                </p>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-base leading-5 font-semibold">
                  Voucher Discount
                </p>
                <p className="text-base leading-5 text-gray-900">
                  -Rs. {orderDetail && orderDetail.voucherDiscount}
                </p>
              </div>
              <hr className="border-1 border-dotted border-gray-500 w-full" />
              <div className="flex justify-between w-full">
                <p className="text-base leading-5 font-semibold">Total</p>
                <p className="text-base leading-5 text-gray-900">
                  Rs. {orderDetail && orderDetail.totalPrice}
                </p>
              </div>
            </div>
          </div>
          {orderDetail.currentProgress === "pending" && (
            <div className="pt-10 mt-6">
              <Button
                isLoading={cancelButtonLoader}
                onClick={handleCancelOrder}
                color="danger"
                fullWidth
              >
                Cancel This Order
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
