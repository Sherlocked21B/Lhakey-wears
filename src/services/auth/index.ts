"use server";
import { AdminType, UserLogin, UserRegister } from "@/lib/types";
import { apiUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export const logUser = async (formData: UserLogin) => {
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async (formData: UserRegister) => {
  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const finalData = await response.json();

    return finalData;
  } catch (e) {
    console.log("error", e);
  }
};

export const registerAdminUser = async (formData: AdminType) => {
  try {
    const response = await fetch(`${apiUrl}/admins/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
      body: JSON.stringify(formData),
    });

    const finalData = await response.json();

    return finalData;
  } catch (e) {
    console.log("error", e);
  }
};

export const getAdminUser = async () => {
  try {
    const res = await fetch(`${apiUrl}/admins/all`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteAdmin = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/admins/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cookies().get("token")?.value}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};
