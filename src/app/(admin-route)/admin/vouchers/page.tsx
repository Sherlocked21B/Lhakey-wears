import CreateAdmin from "@/components/Forms/CreateAdmin";
import CreateVoucher from "@/components/Forms/CreateVoucher";
import TableLoading from "@/components/Loading/TableLoading";
import MyTable from "@/components/Tables/AdminTable";
import { deleteAdmin } from "@/services/auth";
import { deleteVoucher, getAllVouchers } from "@/services/voucher";
import React, { Suspense } from "react";

export default async function VouchersPage() {
  const columns = [
    { name: "CODE", uid: "code", sortable: true },
    { name: "Discount", uid: "discount", sortable: true },
    { name: "START DATE", uid: "start" },
    { name: "EXPIRY DATE", uid: "expiry" },
    { name: "REMAINING VOUCHERS", uid: "totalVoucher" },
    { name: "CATEGORY", uid: "category" },
    { name: "ACTIONS", uid: "actions" },
  ];
  const vouchers = await getAllVouchers();

  return (
    <div className="lg:px-10 xl:px-16 pt-12">
      <h1 className="px-2.5 font-bold text-2xl">Vouchers</h1>
      <Suspense fallback={<TableLoading />}>
        {vouchers && vouchers.data && (
          <MyTable
            deleteItem={deleteVoucher}
            columns={columns}
            users={vouchers.data}
            actions={{ view: false, edit: false, delete: true }}
            modal={CreateVoucher}
          />
        )}
      </Suspense>
    </div>
  );
}
