import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@nextui-org/react";

export default function CartModalCardLoading({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.3, delay: index * 0.1 },
      }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="flex gap-4 items-center shadow-md rounded-md p-2">
      <Skeleton className="w-[100px] h-[100px] rounded-md" />

      <div className="flex flex-col justify-between h-full">
        <Skeleton className="w-32 h-6 rounded-md" />
        <Skeleton className="w-6 h-5 rounded-md" />
        <Skeleton className="w-10 h-5 rounded-md" />
        <Skeleton className="w-16 h-5 rounded-md" />
      </div>
    </motion.div>
  );
}
