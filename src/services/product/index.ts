"use server";
import { ProductType } from "@/lib/types";
import { apiUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export const addProduct = async (formData: ProductType) => {
  try {
    const response = await fetch(`${apiUrl}/product/add`, {
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

export const getAllProducts = async () => {
  try {
    const res = await fetch(`${apiUrl}/product/all`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getProductByCategory = async (category: string) => {
  try {
    const res = await fetch(`${apiUrl}/product/category?category=${category}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${apiUrl}/product/slug?slug=${slug}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (formData: ProductType) => {
  try {
    const res = await fetch(`${apiUrl}/product/update`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
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

export const deleteProduct = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/product/delete?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log(data);

    return data;
  } catch (e) {
    console.log(e);
  }
};
