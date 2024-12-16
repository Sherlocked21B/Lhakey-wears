import React from "react";
import { Skeleton } from "@nextui-org/react";

export default function TableLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row justify-between gap-3 lg:items-end">
        <Skeleton className="w-full sm:max-w-[44%]" />
        <div className="flex gap-3 justify-between ">
          <Skeleton className="w-40 h-8" />
          <Skeleton className="w-40 h-8" />
          <Skeleton className="w-40 h-8" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="w-40 h-8" />
        <Skeleton className="w-40 h-8" />
      </div>
    </div>
  );
}
