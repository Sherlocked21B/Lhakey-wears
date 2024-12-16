"use server";

import getSession from "@/lib/getSession";
import { UserType } from "@/lib/types";
import { apiUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export const updateUser = async (formData: UserType) => {
  try {
    const session = await getSession();
    const userRole = session?.user;

    if (!userRole)
      return {
        success: false,
        message: "You are not authenticated to perform this action!!",
      };

    const res = await fetch(`${apiUrl}/user/update`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userRole}`,
      },
      cache: "no-store",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};
