import CreateAdmin from "@/components/Forms/CreateAdmin";
import TableLoading from "@/components/Loading/TableLoading";
import MyTable from "@/components/Tables/AdminTable";
import { deleteAdmin, getAdminUser } from "@/services/auth";
import React, { Suspense } from "react";

export default async function ProductAttributes() {
  const columns = [
    { name: "NAME", uid: "id", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];
  const admins = await getAdminUser();

  return (
    <div className="lg:px-10 xl:px-16 pt-12">
      <h1 className="px-2.5 font-bold text-2xl">Admins</h1>
      <Suspense fallback={<TableLoading />}>
        {admins && admins.data && (
          <MyTable
            deleteItem={deleteAdmin}
            columns={columns}
            users={admins.data}
            actions={{ view: false, edit: false, delete: true }}
            modal={CreateAdmin}
          />
        )}
      </Suspense>
    </div>
  );
}
