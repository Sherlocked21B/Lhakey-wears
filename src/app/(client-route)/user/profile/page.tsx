"use client";
import UserProfileForm from "@/components/Forms/UserProfile";
import { useSession } from "next-auth/react";
import React from "react";

export default function UserProfile() {
  const session = useSession();
  const user = session.data?.user;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold pl-2">My Profile</h2>
      {user && <UserProfileForm user={user} />}
    </div>
  );
}
