import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@nextui-org/react";

export default function UserOrderCardLoading() {
  return (
    <div className="flex flex-col pt-4 gap-4">
      <div className="flex justify-between">
        <Skeleton className="w-80 h-10" />
        <Skeleton className="w-48 h-10" />
      </div>
      <div className="flex gap-2 items-center">
        {Array.from({ length: 3 }).map((item, index) => (
          <Skeleton
            key={index}
            className="w-[100px] h-[100px] rounded-md shadow-md"
          />
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <Skeleton className="w-36 h-8" />
        <Skeleton className="w-36 h-8" />
        <Skeleton className="w-36 h-8" />
      </div>
    </div>
  );
}
