import { OrderType } from "@/lib/types";
import React from "react";
import NextImage from "next/image";
import { Image } from "@nextui-org/react";
import Link from "next/link";

export default function UserOrderCard({
  orderDetail,
}: {
  orderDetail: OrderType;
}) {
  return (
    <div className="flex flex-col pt-4 gap-4">
      <div className="flex justify-between">
        <p className="font-semibold text-lg">#order: {orderDetail._id}</p>
        <span className="flex gap-1 items-center">
          Total paid amount:{" "}
          <p className="font-semibold text-lg">Rs. {orderDetail.totalPrice}</p>
        </span>
      </div>
      <div className="flex gap-2 items-center">
        {orderDetail.orderItems.map((item) => (
          <Image
            key={`${item.productName} ${item.color} ${item.size}`}
            className="w-[100px] h-[100px] object-cover rounded-md shadow-md"
            as={NextImage}
            src={item.image}
            height={150}
            width={150}
            alt={`${item.productName} ${item.color} ${item.size}`}
          />
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <span className="flex gap-1">
          Order Status:{" "}
          <p className="font-semibold uppercase">
            {orderDetail.currentProgress}
          </p>
        </span>
        <span className="flex gap-1">
          Payment Method:{" "}
          <p className="font-semibold uppercase">{orderDetail.paymentMethod}</p>
        </span>
        <Link href={`/user/orders/${orderDetail._id}`}>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:opacity-80">
            View Order Detail
          </button>
        </Link>
      </div>
    </div>
  );
}
