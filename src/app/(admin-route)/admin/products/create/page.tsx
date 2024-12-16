import CreateProduct from "@/components/Forms/CreateProduct";
import React from "react";

export default function AddProduct() {
  return (
    <div className="lg:px-10 xl:px-16 pt-12 h-svh overflow-y-scroll">
      <h1 className="px-2.5 font-bold text-2xl mb-10">Create Product</h1>
      <CreateProduct />
    </div>
  );
}
