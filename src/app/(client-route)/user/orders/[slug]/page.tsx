import OrderDetail from "@/components/OrderDetail";
import { getOrderById } from "@/services/order";
import React from "react";

export default async function OrderDetailPage({
  params,
}: {
  params: { [key: string]: string };
}) {
  const orderDetail = await getOrderById(params.slug);
  return (
    <>
      {orderDetail && orderDetail.data && (
        <OrderDetail orderDetail={orderDetail.data} />
      )}
    </>
  );
}
