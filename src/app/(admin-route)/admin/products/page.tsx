import CreateAdmin from "@/components/Forms/CreateAdmin";
import TableLoading from "@/components/Loading/TableLoading";
import MyTable from "@/components/Tables/AdminTable";
import { deleteProduct, getAllProducts } from "@/services/product";
import React, { Suspense } from "react";

export default async function AdminProducts() {
  const columns = [
    { name: "NAME", uid: "name", sortable: true },
    { name: "PRICE", uid: "price", sortable: true },
    { name: "STOCK", uid: "stock", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];
  const products = await getAllProducts();

  return (
    <div className="lg:px-10 xl:px-16 pt-12">
      <h1 className="px-2.5 font-bold text-2xl">Products</h1>
      <Suspense fallback={<TableLoading />}>
        {products && products.data && (
          <MyTable
            deleteItem={deleteProduct}
            columns={columns}
            users={products.data}
            actions={{ view: true, edit: true, delete: true }}
            createPage="/admin/products/create"
          />
        )}
      </Suspense>
    </div>
  );
}
