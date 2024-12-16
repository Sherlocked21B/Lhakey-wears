"use server";
import { CartType, FormCartType } from "@/lib/types";
import { apiUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export const addToCart = async (formData: FormCartType) => {
  try {
    const response = await fetch(`${apiUrl}/cart/add`, {
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

export const getAllCartItems = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/cart/all?id=${id}`, {
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

export const updateCart = async (formData: CartType, action: string) => {
  try {
    const res = await fetch(`${apiUrl}/cart/update?action=${action}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${cookies().get("token")?.value}`,
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

export const deleteCart = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/cart/delete?id=${id}`, {
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

export const selectCart = async (userID: string, action: string) => {
  try {
    const res = await fetch(
      `${apiUrl}/cart/select?action=${action}&userID=${userID}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const singleSelectCart = async (userID: string, id: string) => {
  try {
    const res = await fetch(
      `${apiUrl}/cart/single-select?userID=${userID}&id=${id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
        cache: "no-store",
      }
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};
