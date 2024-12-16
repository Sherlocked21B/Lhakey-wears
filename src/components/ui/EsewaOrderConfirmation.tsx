"use client";

import { generateSignatureFromMessage } from "@/lib/utils";
import { updatePaidStatus } from "@/services/order";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

export default function EsewaOrderConfirmation({
  data,
  setCallGetAllUserOrders,
}: {
  data: string;
  setCallGetAllUserOrders: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const session = useSession();

  async function esewaOrderConfirmation() {
    const userID = session.data?.user?.id;
    const orderId = JSON.parse(localStorage.getItem("orderId") as string);
    const decodedData = JSON.parse(atob(data));
    const signature = generateSignatureFromMessage(
      `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code},signed_field_names=${decodedData.signed_field_names}`
    );
    console.log("Decoded DAta: ", decodedData);
    console.log("Signature: ", signature);

    if (
      // decodedData.signature === signature && I need to fix this....
      decodedData.status === "COMPLETE"
    ) {
      console.log("Order Id:", orderId, "User Id:", userID);

      const res = await updatePaidStatus(orderId as string, userID as string);
      if (res.success) {
        toast.success("Order Placed Successfully");
        localStorage.removeItem("orderId");
        localStorage.removeItem("voucher");
        setCallGetAllUserOrders(true);
      } else {
        toast.error("Something went wrong. Please try again later!!!");
      }
    } else {
      toast.error("Failed to verify the data from esewa");
    }
    // setCallGetAllUserOrders(true);
  }
  useEffect(() => {
    session.status === "authenticated" && esewaOrderConfirmation();
  }, [session]);
  return <></>;
}
