import { cn } from "@/lib/utils";
import React from "react";

export default function OrderProgress({
  currentProgress,
  orderUpdatedAt,
}: {
  currentProgress: string;
  orderUpdatedAt: string;
}) {
  return (
    <div className="flex flex-col gap-6 h-20">
      {currentProgress === "delivered" && (
        <p>Your order was delivered in {orderUpdatedAt}</p>
      )}
      <div className="flex items-center justify-center w-full">
        <div className="size-4 rounded-full bg-success relative z-10">
          <p className="absolute -bottom-10 -left-8">Processing</p>
        </div>
        <div
          className={cn(
            "w-60 h-2 bg-gray-300 -translate-x-1",
            currentProgress !== "pending" && "bg-success"
          )}
        ></div>
        <div
          className={cn(
            "size-4 rounded-full bg-gray-300 -translate-x-2 relative z-10",
            currentProgress !== "pending" && "bg-success"
          )}
        >
          <p className="absolute -bottom-10 -left-6">Shipped</p>
        </div>
        <div
          className={cn(
            "w-60 h-2 bg-gray-300 -translate-x-3",
            currentProgress === "delivered" && "bg-success"
          )}
        ></div>
        <div
          className={cn(
            "size-4 rounded-full bg-gray-300 -translate-x-4 relative",
            currentProgress === "delivered" && "bg-success"
          )}
        >
          <p className="absolute -bottom-10 -left-8">Delivered</p>
        </div>
      </div>
    </div>
  );
}
