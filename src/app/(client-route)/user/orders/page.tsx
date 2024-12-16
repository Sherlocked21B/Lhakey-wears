"use client";

import UserOrderCard from "@/components/Cards/UserOrderCard";
import UserOrderCardLoading from "@/components/Loading/UserOrderLoading";
import EsewaOrderConfirmation from "@/components/ui/EsewaOrderConfirmation";
import { OrderType } from "@/lib/types";
import { getAllOrdersForUser } from "@/services/order";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

function SearchParamsChecker({
  setCallGetAllUserOrders,
}: {
  setCallGetAllUserOrders: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const data = useSearchParams()?.get("data");

  if (!data) {
    setCallGetAllUserOrders(true);
  }
  return (
    <>
      {data && (
        <EsewaOrderConfirmation
          setCallGetAllUserOrders={setCallGetAllUserOrders}
          data={data}
        />
      )}
    </>
  );
}

export default function UserOrdersPage() {
  const [pageLevelLoader, setPageLevelLoader] = useState(true);
  const [userOrders, setUserOrders] = useState<[] | OrderType[]>([]);
  const [callGetAllUserOrders, setcallGetAllUserOrders] = useState(false);
  const session = useSession();
  const user = session.data?.user;

  async function getAllUserOrders() {
    setPageLevelLoader(true);
    console.log(user);

    const res = await getAllOrdersForUser(session.data?.user?.id as string);
    if (res.success) {
      setUserOrders(res.data);
    } else {
      toast.error("Error while fetching orders for user");
    }
    setPageLevelLoader(false);
  }
  useEffect(() => {
    console.log("Calling Use effect");

    user && callGetAllUserOrders && getAllUserOrders();
  }, [user, callGetAllUserOrders]);
  return (
    <div className="h-full pb-16">
      <Suspense fallback={null}>
        <SearchParamsChecker
          setCallGetAllUserOrders={setcallGetAllUserOrders}
        />
      </Suspense>
      <div className="flex flex-col gap-4 h-full divide-y-3 overflow-y-auto pr-10">
        {pageLevelLoader ? (
          <>
            {Array.from({ length: 3 }).map((_, index: number) => (
              <UserOrderCardLoading key={index} />
            ))}
          </>
        ) : userOrders && userOrders.length > 0 ? (
          userOrders.map((item) => (
            <UserOrderCard key={item._id} orderDetail={item} />
          ))
        ) : (
          <h2 className="text-xl font-semibold text-center">
            You haven&apos;t made any orders yet...
          </h2>
        )}
      </div>
    </div>
  );
}
