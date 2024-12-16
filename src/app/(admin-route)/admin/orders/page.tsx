import TableLoading from "@/components/Loading/TableLoading";
import MyTable from "@/components/Tables/AdminTable";
import { deleteOrder, getAllOrders } from "@/services/order";
import React, { Suspense } from "react";

export default async function AllOrdersAdmin() {
  const columns = [
    { name: "ID", uid: "_id", sortable: true },
    { name: "EMAIL", uid: "userEmail", sortable: true },
    { name: "PRICE", uid: "totalPrice", sortable: true },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "PAYMENT", uid: "paymentMethod", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];
  const products = await getAllOrders();

  return (
    <div className="lg:px-10 xl:px-16 pt-12">
      <h1 className="px-2.5 font-bold text-2xl">Orders</h1>
      <Suspense fallback={<TableLoading />}>
        {products && products.data && (
          <MyTable
            deleteItem={deleteOrder}
            columns={columns}
            users={products.data}
            actions={{ view: false, edit: false, delete: true }}
            createPage="/admin/products/create"
          />
        )}
      </Suspense>
    </div>
  );
}
