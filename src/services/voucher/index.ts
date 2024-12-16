"use server";
import { VoucherType } from "@/lib/types";
import { apiUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export const addVoucher = async (formData: VoucherType) => {
  try {
    const response = await fetch(`${apiUrl}/voucher/add`, {
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

export const getAllVouchers = async () => {
  try {
    const res = await fetch(`${apiUrl}/voucher/all`, {
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

export const updateVoucher = async (formData: VoucherType) => {
  try {
    const res = await fetch(`${apiUrl}/voucher/update`, {
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

export const deleteVoucher = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/voucher/delete?id=${id}`, {
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

export const searchVoucher = async (code: string) => {
  try {
    const res = await fetch(`${apiUrl}/voucher/search?code=${code}`, {
      method: "GET",
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
